class CatDescription < ApplicationRecord
  belongs_to :language
  validates :language, presence: true

  belongs_to :category
  validates :category, presence: true

  validates :content, presence: true, length: { minimum: 2, maximum: 1000 }
end
