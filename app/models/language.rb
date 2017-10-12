class Language < ApplicationRecord
    has_many :cat_descriptions, :dependent => :destroy
    accepts_nested_attributes_for :cat_descriptions, allow_destroy: true

    has_many :pic_descriptions, :dependent => :destroy
    accepts_nested_attributes_for :pic_descriptions, allow_destroy: true

    has_one :presentation, :dependent => :destroy
    accepts_nested_attributes_for :presentation, allow_destroy: true

    validates :name, presence: true, length: { minimum: 2, maximum: 30 },
              uniqueness: { case_sensitive: false }
    validates :abbreviation, presence: true, length: { minimum: 2, maximum: 5 },
              uniqueness: { case_sensitive: false }
end
