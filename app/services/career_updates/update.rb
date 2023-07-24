module CareerUpdates
  class Update
    def initialize(career_update:, current_user:, params:)
      @sender = params[:current_user]
      @message = params[:message]
      @goals = params[:goals]
      @career_update = career_update
    end

    def call
      if @sender.id != @career_update.user.id
        # The user requesting the update is different than the owner of the update
        raise "Error editing career update. The owner is different than the requester"
      end

      career_update = update_career_update
      career_update.reload
    end

    private

    attr_reader :sender, :message, :goals

    def update_career_update
      ActiveRecord::Base.transaction do
        @career_update = CareerUpdate.find_by(uuid: params[:id])
        if @career_update.present? && current_user
          career_update = @career_update.update!(
            text: message
          )
        end
        # Career Update #4 - Goal #1
        # Se o user escolher o goal #1 e #2 para associar ao career update #4
        # Vai ter que criar a associação com o Goal #2 sem duplicar nem destruir a associação com o Goal #1

         #no career_associations é criar - career_update_id #4 e goal_id #2,
         #ficando com 2 entradas no career_associations - c_u #4, g #1 e c_u #4 g #2

        # Start: Career Update #4 - Goal #1, #2
        # End: Career Update #4 - Goal #1, #3

        # Start: Career Update #4 - Goal #1, #3
        # End: Career Update #4 - Goal #3

        career_update&.each do |career_update|
          career_update = CareerUpdates.find(career_update[:id])
          career_update.career_update_associations.find((career_update[:id])) << career_update
        end

        career_update
      end
    end
  end
end
