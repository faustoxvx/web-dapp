class TokenAcquiredNotification < BaseNotification
  param "source_id"
  deliver_by :email, mailer: "TokenAcquiredMailer", method: :new_supporter, delay: 15.minutes, if: :new_supporter?
  deliver_by :email, mailer: "TokenAcquiredMailer", method: :existing_supporter, delay: 15.minutes, if: :existing_supporter?

  def actions
    [
      {
        hierarchy: "primary",
        label: t(".button"),
        request_type: "GET",
        url: messages_url(user: source&.username)
      }
    ]
  end

  def body
    t(".body", amount: params["amount"])
  end

  def url
    user_url(recipient.username, tab: "supporters")
  end

  private

  def new_supporter?
    should_deliver_immediate_email? && !reinvestment?
  end

  def existing_supporter?
    should_deliver_immediate_email? && reinvestment?
  end

  def reinvestment?
    params["reinvestment"]
  end
end
