module CareerUpdates
  class Update
    def initialize(career_update:, current_user:, params:)
      @sender = current_user
      @message = params[:message]
      @goals = params[:goals]
      @career_update = career_update
      @career_update_associations = params[:career_update_associations]
    end

    def call
      if @sender.id != @career_update.user.id
        # The user requesting the update is different than the owner of the update
        raise "Error editing career update. The owner is different than the requester"
      end

      puts "[CareerUpdates::Update] Call received."
      career_update = update_career_update
      career_update.reload
    end

    private

    attr_reader :sender, :message, :goals, :career_update

    def update_career_update
      ActiveRecord::Base.transaction do
        @career_update.update!(text: message) if @career_update.text != message
        @career_update.career_update_associations.destroy_all
        goals&.each do |goal|
          goal = Goal.find(goal[:id])
          @career_update.goals << goal
        end

        @career_update
      end
    end
  end
end
