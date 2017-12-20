class Setting < ApplicationRecord
  
  validates :maintitle, presence: true, length: { minimum: 2, maximum: 20 }
  validates :subtitle, presence: true, length: { minimum: 2, maximum: 40 }
  validates :navbarcolor, presence: true, format: { with: /\A#[a-fA-F0-9]{6}\Z/ }
  validates :navbarfont, presence: true, format: { with: /\A#[a-fA-F0-9]{6}\Z/ }
  validates :background_color, presence: true, format: { with: /\A#[a-fA-F0-9]{6}\Z/ }
  
  # http://www.rubydoc.info/gems/paperclip/Paperclip/ClassMethods
  # the '#' sign is used to centrally crop the image to fit the dimensions specified
  has_attached_file :background, styles: { medium: "2500x2500>" },
                    :default_style => 'medium'
  validates_attachment :background, size: { in: 0..4000.kilobytes }
  validates_attachment_file_name :background, matches: [/png\z/i, /jpe?g\z/i]

end