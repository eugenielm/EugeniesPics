EugeniesPics
==========

'EugeniesPics' is a photography gallery website (WIP!), whose backend is
implemented with Ruby on Rails - the frontend will be implemented using React.

More about Ruby on Rails web framework: http://guides.rubyonrails.org/


Repository content
------------------
+ an app directory, containing:
  + assets directory
  + channels directory
  + controllers directory
  + helpers directory
  + jobs directory
  + mailers directory
  + models directory
  + views directory

+ a bin directory containig the folowing files: bundle, rails, rake, setup, spring,
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
apple-touch-icon-precomposed.png, apple-touch-icon.png, favicon.ico, robots.txt

+ a test directory, containing:
  + a controllers directory, containing the tests for the categories, pictures,
  sessions, users and welcome controllers
  + a fixtures directory, containing a files directory (empty), and 3 files:
  categories.yml, pictures.yml and users.yml
  + a helpers directory (empty)
  + an integration directory (empty)
  + a mailers directory (empty)
  + a models directory, containg the tests for the user, category, and picture
  models
  + a system directory, containing categories_test.rb and users_test.rb
  + application_system_test_case.rb
  + test_helper.rb

+ a vendor directory (empty)

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

1. Make sure you have Ruby installed on your computer

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
NB: by default the server will run locally on port 3000
To use another port:
```sh
bundle exec rails server -p <port>
```

5. To create a superadmin user profile:
  + go to the URL: 'http://localhost:3000/signup'
  + use the form to sign up
  + in the command line, run
  ```sh
  rails console
  ```
  + once in the rails console, type in:
  ```sh
  u = User.last
  ```
  + and finally you can run the following command to be allowed to CRUD objects:
  ```sh
  u.update_column :superadmin, true
  ```

6. With your rails server still running locally on port 3000, you can log in on
'http://localhost:3000/login' and create/update/delete categories and pictures!


How to run the tests
--------------------
In the command line, navigate to the project directory and run the following command:
  ```sh
  rails test
  ```


Room for improvement
--------------------
This project is still WIP:
- need to implement the front-end with React framework
