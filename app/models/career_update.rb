class CareerUpdate < ApplicationRecord
  belongs_to :user
  has_many :career_update_associations, dependent: :destroy
  has_many :goals, through: :career_update_associations, source: :associable_entity, source_type: "Goal"
  has_many :milestones, through: :career_update_associations, source: :associable_entity, source_type: "Milestone"

  has_encrypted :text

  validates :text_ciphertext, presence: true
end
