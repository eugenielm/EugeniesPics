class Picture < ApplicationRecord
  # active record associations: http://guides.rubyonrails.org/association_basics.html
  # validation doc: http://guides.rubyonrails.org/active_record_validations.html
  belongs_to :category
  validates :category, presence: true
  validates :title, presence: true, length: { minimum: 1, maximum: 30 },
            uniqueness: { case_sensitive: false }
  validates :author, presence: true, length: { minimum: 2, maximum: 30 }
  validates :description, presence: true, length: { minimum: 4, maximum: 500 }
  # http://www.rubydoc.info/gems/paperclip/Paperclip/ClassMethods
  has_attached_file :picfile, styles: { medium: "800x600>", small: "160x120>" },
                    default_style: 'small'
  validates_attachment :picfile, presence: true,
                       size: { in: 0..1.megabytes }
  validates_attachment_file_name :picfile, matches: [/png\z/i, /jpe?g\z/i]
end
