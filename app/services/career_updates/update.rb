module CareerUpdates
  class Update
    def initialize(career_update:, current_user:, params:)
      @sender = current_user
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
        career_update = @career_update.update!(
          text: message
        )

        # Career Update #4 - Goal #1
        # Se o user escolher o goal #1 e #2 para associar ao career update #4
        # Vai ter que criar a associação com o Goal #2 sem duplicar nem destruir a associação com o Goal #1

        # Start: Career Update #4 - Goal #1, #2
        # End: Career Update #4 - Goal #1, #3

        # Start: Career Update #4 - Goal #1, #3
        # End: Career Update #4 - Goal #3

        goals&.each do |goal|
          goal = Goal.find(goal[:id])
          career_update.goals << goal
        end

        career_update
      end
    end
  end
end
