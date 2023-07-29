-- Use SQL insert statements to add any
-- starting/dummy data to your database tables

-- EXAMPLE:

--  insert into "todos"
--    ("task", "isCompleted")
--    values
--      ('Learn to code', false),
--      ('Build projects', false),
--      ('Get a job', false);

insert into "users" ("username", "hashedPassword", "email")
values
    ('testUser', 'testPassword', 'testEmail');

insert into "lists" ("name", "userId")
values
    ('testMedListName', 1);

insert into "listContent" ("medicationId", "genericName", "dosage", "route", "frequency", "listId")
values
    ('e11f08b2-f8ea-40e4-b865-9fa3a31399b4', 'LIDOCAINE', 'N/A', 'topical', 'PRN', 1);
