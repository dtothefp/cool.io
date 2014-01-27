###WDI-HW Submission

######Description

- Cool.io is an application that gives the user a graphical tally of how many times each of their friends have liked or commented on their Facebook wall posts, links, photos, and status updates.  

######Technologies Implemented
- Rails/Active Record/PostgreSQL
- JavaScript/jQuery, Backbone.js, D3.js
- Facebook JavaScript SDK and Open Graph API
- Redis/resque

![image](https://dl.dropboxusercontent.com/u/8073874/Screen%20Shot%202014-01-27%20at%2010.36.30%20AM.png)

######ERD & Brief Technical Overview

![image](https://lh5.googleusercontent.com/-AcK6eAYiJF8/Uqy2rIgvE3I/AAAAAAAABNo/ng5clqvDF58/w783-h554-no/IMG_20131214_144445407.jpg)

- Note: The above ERD represents posts/links/photos/statuses having a polymorphic association with shares.  The schema has since been changed to include all wall post types in one table using single table inheritance, and having a relationship with users through the Shares join table.  The latest schema is viewable in the generated depiction below.

![image](https://dl.dropboxusercontent.com/u/8073874/Screen%20Shot%202014-01-15%20at%204.24.27%20PM.png)

- The Shares includes boolean columns to denote if the user is the author or the commenter/liker of the posts.

- A couple interesting SQL commands mixed into active record, and then some Ruby iterations tally the like/comment counts from the Shares table.  

```bash
result = ActiveRecord::Base.connection.execute("SELECT post_id FROM shares WHERE user_id = #{user.id} AND author = true")
processed_result = result.map do |post|
  ActiveRecord::Base.connection.execute("SELECT user_id, COUNT(user_id) FROM shares WHERE post_id = #{post["post_id"]} AND (commenter = true OR liker = true) AND (user_id != #{user.id}) GROUP BY user_id;")
end
```
- The resulting tallied count is then stored in the Users table, and this table is synced with the Friendships collection in Backbone.  The collection is then used as data in D3, iterated over and associated with various SVG elements.  This is a very interesting model because each SVG element now contains all of the data from each Postgres entry.

- As soon as a user logs, a chain reaction of Resque methods activates worker queues utilizing the Redis server.  These workers process in the background the database associations of a user's friends, the user's posts, the relationship of the posts to the users, and the tallying of post like/comment count. 

######Plans for the Future

- Currently a user can sign-up/login with Facebook and can view all of their friends interactions with their profile.  In the near future Cool.io would like to implement features for viewing specific post information and to make connections between friends of friends relationships as more users authenticate the app.

######INSPIRATION

![image](http://blogs.villagevoice.com/music/images/Coolio-575-old.jpg)





