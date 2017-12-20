# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20171219184438) do

  create_table "cat_descriptions", force: :cascade do |t|
    t.text "content"
    t.integer "language_id"
    t.integer "category_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["category_id"], name: "index_cat_descriptions_on_category_id"
    t.index ["language_id"], name: "index_cat_descriptions_on_language_id"
  end

  create_table "categories", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "catpic_file_name"
    t.string "catpic_content_type"
    t.integer "catpic_file_size"
    t.datetime "catpic_updated_at"
    t.index ["catpic_file_name"], name: "index_categories_on_catpic_file_name", unique: true
    t.index ["name"], name: "index_categories_on_name", unique: true
  end

  create_table "languages", force: :cascade do |t|
    t.string "name"
    t.string "abbreviation"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["abbreviation"], name: "index_languages_on_abbreviation", unique: true
    t.index ["name"], name: "index_languages_on_name", unique: true
  end

  create_table "pic_descriptions", force: :cascade do |t|
    t.text "content"
    t.integer "language_id"
    t.integer "picture_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["language_id"], name: "index_pic_descriptions_on_language_id"
    t.index ["picture_id"], name: "index_pic_descriptions_on_picture_id"
  end

  create_table "pictures", force: :cascade do |t|
    t.string "title"
    t.string "author"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "category_id"
    t.string "picfile_file_name"
    t.string "picfile_content_type"
    t.integer "picfile_file_size"
    t.datetime "picfile_updated_at"
    t.index ["category_id"], name: "index_pictures_on_category_id"
    t.index ["picfile_file_name"], name: "index_pictures_on_picfile_file_name", unique: true
    t.index ["title"], name: "index_pictures_on_title", unique: true
  end

  create_table "presentations", force: :cascade do |t|
    t.text "content"
    t.integer "language_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["language_id"], name: "index_presentations_on_language_id", unique: true
  end

  create_table "settings", force: :cascade do |t|
    t.string "maintitle"
    t.string "subtitle"
    t.string "navbarcolor"
    t.string "navbarfont"
    t.string "background_file_name"
    t.string "background_content_type"
    t.integer "background_file_size"
    t.datetime "background_updated_at"
    t.string "background_color", default: "#eeeeee"
  end

  create_table "users", force: :cascade do |t|
    t.string "email"
    t.string "password_digest"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "username"
    t.boolean "superadmin", default: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["username"], name: "index_users_on_username", unique: true
  end

end
