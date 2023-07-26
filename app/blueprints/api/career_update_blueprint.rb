class API::CareerUpdateBlueprint < Blueprinter::Base
  view :normal do
    fields :message, :created_at

    field :id do |career_update, _options|
      career_update.uuid
    end

    field :message do |career_update, _options|
      career_update.text
    end

    field :career_update_associations do |career_update, _options|
      career_update.career_update_associations
    end
  end
end
