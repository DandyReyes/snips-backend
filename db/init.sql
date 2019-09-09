DROP TABLE IF EXISTS snippet;
CREATE TABLE snippet (
  id SERIAL PRIMARY KEY,
  code TEXT,
  title TEXT,
  description TEXT,
  favorites INT DEFAULT 0,
  author TEXT,
  language TEXT
);

INSERT INTO
  snippet(code, title, description, author)
VALUES
  (
    'cont america = 1776',
    'freedom',
    'I declared a const',
    'Dandy'
  ),
  (
    '4+4',
    'addition',
    'Algebra',
    'Scott'
  );

  