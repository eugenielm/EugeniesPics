source 'https://rubygems.org'
ruby '2.4.0'

git_source(:github) do |repo_name|
  repo_name = "#{repo_name}/#{repo_name}" unless repo_name.include?("/")
  "https://github.com/#{repo_name}.git"
end


# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem 'rails', '~> 5.1.2'
# Use Puma as the app server
gem 'puma', '3.9.1'
# Use SCSS for stylesheets
gem 'sass-rails', '5.0.6'
# Use Uglifier as compressor for JavaScript assets
gem 'uglifier', '3.2.0'
# See https://github.com/rails/execjs#readme for more supported runtimes
# gem 'therubyracer', platforms: :ruby

# Use CoffeeScript for .coffee assets and views
gem 'coffee-rails', '4.2.2'
gem 'jquery-rails', '4.3.1'
# Turbolinks makes navigating your web application faster. Read more: https://github.com/turbolinks/turbolinks
gem 'turbolinks', '5.0.1'
# Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
gem 'jbuilder', '2.6.4'
# Use Redis adapter to run Action Cable in production
# gem 'redis', '~> 3.0'
# Use Capistrano for deployment
# gem 'capistrano-rails', group: :development

group :development, :test do
  # Use sqlite3 as the database for Active Record
  gem 'sqlite3', '1.3.13'
  # Call 'byebug' anywhere in the code to stop execution and get a debugger console
  gem 'byebug', '9.0.6', platforms: [:mri, :mingw, :x64_mingw]
  # Adds support for Capybara system testing and selenium driver
  gem 'capybara', '~> 2.13'
  gem 'selenium-webdriver'
end

group :development do
  # Access an IRB console on exception pages or by using <%= console %> anywhere in the code.
  gem 'web-console', '3.5.1'
  gem 'listen', '3.0.8'
  # Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
  gem 'spring', '2.0.2'
  gem 'spring-watcher-listen', '2.0.1'
end

group :production do
  gem 'pg', '0.20.0'
end

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem 'tzinfo-data', platforms: [:mingw, :mswin, :x64_mingw, :jruby]

# Added at 2017-07-26 17:28:36 by EGlelek to use ActiveModel has_secure_password:
gem "bcrypt", "~> 3.1"

# Added at 2017-08-01 19:11:44 -0700 by EGlelek (to be able to use assert_template in tests):
gem "rails-controller-testing", "~> 1.0"

# Added at 2017-08-02 18:19:06 -0700 by EGlelek (needed for file attachment to pictures):
# updated from 5.1 to 5.2 2018-01-23
gem "paperclip", "~> 5.2"

# Added at 2017-08-02 20:04:27 -0700 by EGlelek (Paperclip storage adapter for AWS S3):
gem "aws-sdk", "~> 2.10"

# Added at 2017-08-04 11:56:51 -0700 by EGlelek:
gem "ruby", "~> 0.1.0"

# Added at 2017-08-08 10:50:53 -0700 by EGlelek (for ReactJS integration - need to have yarn >= 0.20.1 installed):
gem "webpacker", "~> 2.0"
