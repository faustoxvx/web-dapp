class QuestCompletedNotification < BaseNotification
  include ActionView::Helpers::NumberHelper

  def body
    "You have been credited with #{number_with_delimiter(params["experience_points"])} XP."
  end

  def source
    @source ||= Quest.find_by(id: params["source_id"])
  end

  def url
    quests_url
  end
end
