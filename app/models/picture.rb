class Picture < ApplicationRecord
  
  # active record associations: http://guides.rubyonrails.org/association_basics.html
  # validation doc: http://guides.rubyonrails.org/active_record_validations.html
  belongs_to :category
  validates :category, presence: true

  has_many :pic_descriptions, :dependent => :destroy
  accepts_nested_attributes_for :pic_descriptions, :allow_destroy => true
  
  validates :title, :presence => true, length: { :minimum => 1, :maximum => 30 },
            :uniqueness => { :case_sensitive => false }
  
  validates :author, :presence => true, :length => { :minimum => 2, :maximum => 30 }
  
  # http://www.rubydoc.info/gems/paperclip/Paperclip/ClassMethods
  # http://www.imagemagick.org/Usage/
  has_attached_file :picfile, :styles => { :large => { :resize => "1300x1300>", :quality => 95 },
                                           :medium => { :resize => "500x500>", :quality => 95 },
                                           :small => { :resize => "250x250>", :quality => 100 } },
                    :convert_options => { large: "-resample \"150\>\"", medium: "-resample \"120\>\"", small: "-resample \"80\>\"" },
                    :default_style => 'small'
  validates_attachment :picfile, :presence => true,
                       :size => { in: 0..8000.kilobytes }
  validates_attachment_file_name :picfile, :matches => [/png\z/i, /jpe?g\z/i]
  validates :picfile_file_name, :uniqueness => { :case_sensitive => false }
  process_in_background :picfile

end
