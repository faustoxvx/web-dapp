class API::V1::PublicAPI::CareerUpdatesController < API::V1::PublicAPI::APIController
  before_action :internal_only
  before_action :authenticated_only

  def index
    unless allowed_to_see_career_updates?
      return unauthorized_request("Logged in user is not a subscriber of the passed user")
    end

    pagy, career_updates = pagy_uuid_cursor(
      user.career_updates,
      before: cursor,
      items: per_page,
      order: {created_at: :desc, uuid: :desc}
    )

    response_body = {
      career_updates: API::CareerUpdateBlueprint.render_as_json(career_updates, view: :normal),
      pagination: {
        total: user.career_updates.count,
        cursor: pagy.has_more? ? career_updates.last.uuid : nil
      }
    }
    log_request(response_body, :ok)

    render json: response_body, status: :ok
  end

  def create
    sender = User.find_by("wallet_id::text = :id OR username::text = :id", id: user_param_id) if user_param_id
    sender ||= current_user

    if career_update_params[:message].blank?
      return render json: {
        error: "Unable to create career update, the message is empty."
      }, status: :bad_request
    end

    service = CareerUpdates::Create.new(
      sender: sender,
      message: career_update_params[:message],
      goals: career_update_params[:goals]
    )
    career_update = service.call

    response_body = {
      career_update: API::CareerUpdateBlueprint.render_as_json(career_update, view: :normal)
    }

    log_request(response_body, :created)

    render json: response_body, status: :created
  end

  def update
    service = CareerUpdate::Update.new(
      career_update: career_update,
      current_user: current_acting_user,
      params: career_update_params
    )
    updated_career_update = service.call

    render json: CareerUpdateBlueprint.render(updated_career_update, view: :normal), status: :ok
  rescue CareerUpdates::Update::StartDateAfterEndDateError => e
    render json: {error: e.message}, status: :unprocessable_entity
  rescue => e
    Rollbar.error(
      e,
      "Unable to edit career update",
      career_update_id: career_update&.id,
      talent_id: talent.id
    )
    render json: {error: "Unable to update career"}, status: :unprocessable_entity
  end

  def destroy
    if career_update.destroy
      render json: CareerUpdateBlueprint.render(career_update, view: :normal), status: :ok
    else
      render json: {error: "Unable to delete requested career update."}, status: :unprocessable_entity
    end
  end

  private

  def user
    @user ||= User.find_by!("wallet_id = :id OR username = :id", id: params[:id])
  end

  def allowed_to_see_career_updates?
    current_user&.admin_or_moderator? || current_user&.id == user.id || current_user&.subscriber_of?(user) || current_user&.amount_invested_in(user)&.positive?
  end

  def career_update_params
    params.require(:career_update)
      .permit(
        :message,
        goals: [:id]
      )
  end

  def user_param_id
    params[:talent] ? params[:talent][:id] : nil
  end
end
