-- Create Keyspace
CREATE KEYSPACE IF NOT EXISTS band_project 
WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1};

USE band_project;

-- Table: band_members_by_band
-- Query Pattern: Q1: Get all members of a band
CREATE TABLE IF NOT EXISTS band_members_by_band (
    band_id int,
    musician_id int,
    band_name text,
    formed_date date,
    genre text,
    stage_name text,
    role text,
    main_instrument_code text,
    joined_date date,
    email text,
    PRIMARY KEY (band_id, musician_id)
) WITH CLUSTERING ORDER BY (musician_id ASC);

-- Table: albums_by_band
-- Query Pattern: Q2: Get all albums of a band, sorted by release date descending
CREATE TABLE IF NOT EXISTS albums_by_band (
    band_id int,
    release_date date,
    album_id int,
    album_title text,
    band_name text,
    format text,
    PRIMARY KEY (band_id, release_date, album_id)
) WITH CLUSTERING ORDER BY (release_date DESC, album_id ASC);

-- Table: tracks_by_album
-- Query Pattern: Q3: Get all tracks of an album, sorted by track number
CREATE TABLE IF NOT EXISTS tracks_by_album (
    album_id int,
    track_no int,
    album_title text,
    song_id int,
    song_title text,
    duration_min double,
    bpm int,
    PRIMARY KEY (album_id, track_no)
) WITH CLUSTERING ORDER BY (track_no ASC);

-- Table: gigs_by_band
-- Query Pattern: Q4: Get all gigs of a band, sorted by gig date descending
CREATE TABLE IF NOT EXISTS gigs_by_band (
    band_id int,
    gig_date date,
    gig_id int,
    band_name text,
    venue text,
    ticket_price double,
    PRIMARY KEY (band_id, gig_date, gig_id)
) WITH CLUSTERING ORDER BY (gig_date DESC, gig_id ASC);
