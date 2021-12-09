class Stats::Retrieve
  def initialize(number_of_weeks)
    @number_of_weeks = number_of_weeks
  end

  def call
    puts "TOTAL USERS: ##{User.count}"
    puts "TOTAL TALENT: ##{Talent.count}"
    puts "TOTAL TALENT (LIVE): ##{Talent.where(public: true).count}"
    puts "TOTAL TOKENS: ##{Token.count}"
    puts "TOTAL TOKENS DEPLOYED: ##{Token.where.not(contract_id: nil)}.count"

    start_date = DateTime.new(2021, 11, 1)

    week_0_users = User.where("created_at < ?", start_date)
    week_0_talent = Talent.where("created_at < ?", start_date)
    week_0_tokens_deployed = Token.where.not(contract_id: nil).where("updated_at < ?", start_date)
    week_0_talent_live = Talent.joins(:token).where(public: true).where.not(token: {contract_id: nil}).where("talent.created_at < ?", start_date)

    puts "------------ WEEK 0 ------------"
    puts "TOTAL USERS: ##{week_0_users.count}"
    puts "TOTAL SUPPORTERS (TALENT - USERS): ##{week_0_users.count - week_0_talent.count}"
    puts "TOTAL TALENT (REGISTERED): ##{week_0_talent.count}"
    puts "TOTAL TOKENS DEPLOYED: ##{week_0_tokens_deployed.count}"
    puts "TOTAL TALENT (LIVE): ##{week_0_talent_live.count}"
    puts "------------ #WEEK 0 ------------"
    puts ""
    puts ""

    # week 1

    end_date = start_date

    @number_of_weeks.times.each do |w|
      start_date = end_date
      end_date = start_date + 1.week

      week_users = User.where("created_at < ? AND created_at >= ?", end_date, start_date)
      week_talent = Talent.where("created_at < ? AND created_at >= ?", end_date, start_date)
      week_tokens_deployed = Token.where.not(contract_id: nil).where("updated_at < ? AND updated_at >= ?", end_date, start_date)
      week_talent_live = Talent.joins(:token).where(public: true).where.not(token: {contract_id: nil}).where("talent.created_at < ? AND talent.created_at >= ?", end_date, start_date)

      puts "------------ WEEK #{w} ------------"
      puts "TOTAL USERS: ##{week_users.count}"
      puts "TOTAL SUPPORTERS (TALENT - USERS): ##{week_users.count - week_talent.count}"
      puts "TOTAL TALENT (REGISTERED): ##{week_talent.count}"
      puts "TOTAL TOKENS DEPLOYED: ##{week_tokens_deployed.count}"
      puts "TOTAL TALENT (LIVE): ##{week_talent_live.count}"
      puts "------------ #WEEK #{w} ------------"
      puts ""
      puts ""
    end
  end
end
