module Users
  class UpdateProfileCompletedAt
    def initialize(user:)
      @user = user
    end

    def call
      profile_completed = user.profile_completed?

      if profile_completed && !user.profile_completed_at
        user.update!(profile_completed_at: Time.current)
        notify_user
        create_feed_activity
      elsif !profile_completed
        user.update!(profile_completed_at: nil)
      end
    end

    private

    attr_reader :user

    def notify_user
      CreateNotification.new.call(
        recipient: user,
        type: CompletedProfileNotification,
        source_id: user.id
      )
    end

    def create_feed_activity
      ActivityIngestJob.perform_later("profile_complete", nil, user.id)
    end
  end
end
