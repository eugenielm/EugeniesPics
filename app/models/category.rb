class Category < ApplicationRecord
  
  has_many :pictures, :dependent => :destroy
  accepts_nested_attributes_for :pictures, allow_destroy: true

  has_many :cat_descriptions, :dependent => :destroy
  accepts_nested_attributes_for :cat_descriptions, allow_destroy: true

  # Validates whether the associated object or objects are all valid. Works with any kind of association.
  # WARNING: This validation must not be used on both ends of an association. Doing so will lead to a circular dependency and cause infinite recursion.
  # validates_associated :pictures
  
  validates :name, presence: true, length: { minimum: 2, maximum: 30 },
            uniqueness: { case_sensitive: false }
  
  # http://www.rubydoc.info/gems/paperclip/Paperclip/ClassMethods
  has_attached_file :catpic, styles: { medium: "1500x1500>", small: "500x500>" },
                    default_style: 'small', :default_url => "/missing-sm.jpg"
  validates_attachment :catpic, size: { in: 0..4000.kilobytes }
  validates_attachment_file_name :catpic, matches: [/png\z/i, /jpe?g\z/i]

end
