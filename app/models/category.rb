class Category < ApplicationRecord
  has_many :pictures, :dependent => :destroy
  # Validates whether the associated object or objects are all valid. Works with any kind of association.
  # WARNING: This validation must not be used on both ends of an association. Doing so will lead to a circular dependency and cause infinite recursion.
  # validates_associated :pictures
  accepts_nested_attributes_for :pictures, allow_destroy: true
  validates :name, presence: true, length: { minimum: 2, maximum: 30 }
end
