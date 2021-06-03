class InvestorsController < ApplicationController
  def index
    @investors = Investor.all
  end

  def show
    @investor =
      if params[:id].to_i > 0
        Investor.find(params[:id])
      else
        Investor.find_by!(public_key: params[:id])
      end
  end
end
