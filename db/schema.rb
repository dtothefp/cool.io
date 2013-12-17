# encoding: UTF-8
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

ActiveRecord::Schema.define(version: 20131217002945) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "friendships", force: true do |t|
    t.integer  "user_id"
    t.integer  "friend_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "photos", force: true do |t|
    t.string   "fb_id"
    t.string   "title"
    t.string   "description"
    t.string   "image_url"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "created_time"
  end

  create_table "posts", force: true do |t|
    t.string   "fb_id"
    t.string   "title"
    t.string   "description"
    t.string   "link_url"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "created_time"
  end

  create_table "shares", force: true do |t|
    t.integer  "shareable_id"
    t.string   "shareable_type"
    t.boolean  "on_wall",        default: false
    t.boolean  "poster",         default: false
    t.boolean  "commenter",      default: false
    t.boolean  "tagger",         default: false
    t.boolean  "tagged",         default: false
    t.integer  "user_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "statuses", force: true do |t|
    t.string   "fb_id"
    t.string   "title"
    t.string   "description"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "created_time"
  end

  create_table "users", force: true do |t|
    t.string   "name"
    t.string   "email"
    t.string   "fb_id"
    t.string   "type"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "oauth_token"
    t.string   "oauth_expires_at"
    t.string   "short_term_token"
  end

end
