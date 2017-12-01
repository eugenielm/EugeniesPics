EugeniesPics
==========

'EugeniesPics' is a dynamic photography gallery website.
The backend is implemented with Ruby on Rails and the frontend with 
ReactJS (using Wepback).

A Puma webserver is used instead of the default RoR webserver bacause it's
single threaded (which is fine in development).
However Puma is better suited for production since it can handle multiple 
requests concurrently.

Nota Bene: this Puma webserver is configured to listen on port 3001.

More about Ruby on Rails web framework: http://guides.rubyonrails.org/


Repository content
------------------
+ an app directory, containing:
  + assets directory (which contains all the stylesheets, images/favicon.ico, 
  and images/eugeniespics.jpg used when sharing on FB)
  + channels directory
  + controllers directory
  + helpers directory
  + jobs directory
  + mailers directory
  + models directory
  + views directory

+ a bin directory containing the following files: bundle, rails, rake, setup, spring,
update, yarn

+ a config directory containing:
  + environment directory, containing development.rb, production.rb, test.rb
  + initializers directory, containing application_controller_renderer.rb,
  assets.rb, backtrace_silencers.rb, cookies_serializer.rb,
  filter_parameter_logging.rb, inflections.rb, mime_types.rb, wrap_parameters.rb
  + locales directory
  + application.rb
  + boot.rb
  + cable.yml
  + database.yml
  + environment.rb
  + puma.rb
  + routes.rb
  + secrets.yml
  + spring.rb

+ db directory, containing:
  + a migrate directory with migration files
  + schema.rb
  + seeds.rb

+ lib directory, containing 2 empty directories: assets and tasks

+ a public directory containing: 404.html, 422.html, 500.html,
apple-touch-icon-precomposed.png, apple-touch-icon.png, favicon.ico, robots.txt,
missing.jpg, eugeniespics_bckgd.jpg

+ a test directory, containing:
  + a controllers directory, containing the tests for all the controllers
  + a fixtures directory, containing a files directory (empty) and fixtures
  + a helpers directory (empty)
  + an integration directory (empty)
  + a mailers directory
  + a models directory, containg the tests for all the models
  + a system directory, containing categories_test.rb and users_test.rb
  + application_system_test_case.rb
  + test_helper.rb

+ a vendor directory (empty)

+ babelrc: needed for Webpacker (gem used for ReactJS support)
+ .gitignore: containing the names of the files which are not to be committed in
version control
+ Gemfile
+ Gemfile.lock
+ Procfile
+ README.md
+ Rakefile
+ config.ru
+ package.json


How does it work
----------------
In order to be able to set up EugeniesPics (locally), you need to:

1. Make sure you have Ruby and Yarn installed on your computer

2. Install ImageMagick on your computer - if you are on Mac, you can install it
with brew:
  ```sh
  brew install imagemagick
  ```

  If you are on Windows, you'll need the Unix 'file' command. See:
  https://github.com/thoughtbot/paperclip#file

3. Clone this repository

4. Open the terminal, navigate to this repository and run the following command:
    ```sh
    bundle exec rails server
    ```

5. You also need to run the webpack dev server locally for React components support.
In your terminal, navigate to the app directory and run the following command:
  ```sh
  ./bin/webpack-dev-server
  ```
More info on the Wepacker gem here: https://github.com/rails/webpacker

6. To create a superadmin user profile:
  + go to the URL: 'http://localhost:3001/signup'
  + use the form to sign up
  + only the first user to register has super admin powers and can administrate 
  the website!

7. With both your Rails server and wepback dev server running locally, you can log
in on 'http://localhost:3001/login' and create/update/delete categories and pictures!

8. Nota Bene: you can access the login page on 'http://localhost:3001/login'


How to run the tests
--------------------
In the command line, navigate to the project directory and run the following command:
  ```sh
  rails test
  ```


Room for improvement
--------------------
This project is still WIP:
- allow the user to request a new password if they lost it
- allow the user to upload the picture for the website background
- allow the user to upload the default picture for categories (currently missing.jpg)
- implement a Facebook 'like' button?