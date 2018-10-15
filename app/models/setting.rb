class Setting < ApplicationRecord
  
  validates :maintitle, :presence => true, :length => { :minimum => 2, :maximum => 20 }
  validates :subtitle, :presence => true, :length => { :minimum => 2, :maximum => 40 }
  validates :navbarcolor, :presence => true, :format => { with: /\A#[a-fA-F0-9]{6}\Z/ }
  validates :navbarfont, :presence => true, :format => { with: /\A#[a-fA-F0-9]{6}\Z/ }
  validates :background_color, :presence => true, :format => { with: /\A#[a-fA-F0-9]{6}\Z/ }
  
  # http://www.rubydoc.info/gems/paperclip/Paperclip/ClassMethods
  # http://www.imagemagick.org/Usage/
  has_attached_file :background, :styles => { :medium => { :geometry => "1800x1800>", :quality => 92 },
                                              :small => { :geometry => "600x600>", :quality => 92 } },
                                 # lighten the background image
                                 :convert_options => { medium: "-resample \"150\>\" -fill white -colorize 50% -blur 0x7", small: "-resample \"80\>\" -fill white -colorize 50% -blur 0x7" },
                                 :default_style => 'small'
  validates_attachment :background, :size => { in: 0..8000.kilobytes }
  validates_attachment_file_name :background, :matches => [/png\z/i, /jpe?g\z/i]

  has_attached_file :id_picture, :styles => { :small => { :geometry => "250x250>", :quality => 95 },
                                              :medium => { :geometry => "600x600>", :quality => 95 } },
                                 :convert_options => { medium: "-resample \"150\>\"", small: "-resample \"80\>\"" },
                                 :default_style => 'small'
  validates_attachment :id_picture, :size => { in: 0..8000.kilobytes }
  validates_attachment_file_name :id_picture, :matches => [/png\z/i, /jpe?g\z/i]

end