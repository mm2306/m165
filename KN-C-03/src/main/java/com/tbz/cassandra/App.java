package com.tbz.cassandra;

import com.datastax.oss.driver.api.core.CqlSession;
import com.datastax.oss.driver.api.core.cql.ResultSet;
import com.datastax.oss.driver.api.core.cql.Row;
import java.net.InetSocketAddress;
import java.time.LocalDate;

public class App {
    public static void main(String[] args) {
        // Disable driver warnings from standard output to keep output clean
        System.setProperty("org.slf4j.simpleLogger.defaultLogLevel", "warn");
        
        System.out.println("Connecting to Cassandra...");
        
        try (CqlSession session = CqlSession.builder()
                .addContactPoint(new InetSocketAddress("127.0.0.1", 9042))
                .withLocalDatacenter("datacenter1")
                .withKeyspace("band_project")
                .build()) {
            
            System.out.println("Connected to Cassandra cluster successfully.");
            System.out.println("========================================================================");
            
            // Q1: Band Members
            System.out.println("\n>>> Q1: Band Members of Band 1 (The Rockers) <<<");
            ResultSet rs1 = session.execute(
                "SELECT musician_id, stage_name, role, main_instrument_code, joined_date, email " +
                "FROM band_members_by_band " +
                "WHERE band_id = 1;"
            );
            System.out.println("+-------------+------------------+-------------+-------------+-------------+------------------------+");
            System.out.printf("| %-11s | %-16s | %-11s | %-11s | %-11s | %-22s |\n", 
                "musician_id", "stage_name", "role", "instrument", "joined_date", "email");
            System.out.println("+-------------+------------------+-------------+-------------+-------------+------------------------+");
            for (Row row : rs1) {
                int musicianId = row.getInt("musician_id");
                String stageName = row.getString("stage_name");
                String role = row.getString("role");
                String instrument = row.getString("main_instrument_code");
                LocalDate joinedDate = row.getLocalDate("joined_date");
                String email = row.getString("email");
                System.out.printf("| %-11d | %-16s | %-11s | %-11s | %-11s | %-22s |\n", 
                    musicianId, 
                    stageName != null ? "'" + stageName + "'" : "null", 
                    role != null ? "'" + role + "'" : "null", 
                    instrument != null ? "'" + instrument + "'" : "null", 
                    joinedDate, 
                    email != null ? "'" + email + "'" : "null");
            }
            System.out.println("+-------------+------------------+-------------+-------------+-------------+------------------------+");
            System.out.println("========================================================================");
            
            // Q2: Albums
            System.out.println("\n>>> Q2: Albums of Band 1 (Sorted by Release Date Desc) <<<");
            ResultSet rs2 = session.execute(
                "SELECT release_date, album_id, album_title, format " +
                "FROM albums_by_band " +
                "WHERE band_id = 1;"
            );
            System.out.println("+--------------+----------+--------------------+-----------+");
            System.out.printf("| %-12s | %-8s | %-18s | %-9s |\n", 
                "release_date", "album_id", "album_title", "format");
            System.out.println("+--------------+----------+--------------------+-----------+");
            for (Row row : rs2) {
                LocalDate releaseDate = row.getLocalDate("release_date");
                int albumId = row.getInt("album_id");
                String albumTitle = row.getString("album_title");
                String format = row.getString("format");
                System.out.printf("| %-12s | %-8d | %-18s | %-9s |\n", 
                    releaseDate != null ? "'" + releaseDate + "'" : "null", 
                    albumId, 
                    albumTitle != null ? "'" + albumTitle + "'" : "null", 
                    format != null ? "'" + format + "'" : "null");
            }
            System.out.println("+--------------+----------+--------------------+-----------+");
            System.out.println("========================================================================");
            
            // Q3: Tracks
            System.out.println("\n>>> Q3: Tracks of Album 201 (Sorted by Track No Asc) <<<");
            ResultSet rs3 = session.execute(
                "SELECT track_no, song_id, song_title, duration_min, bpm " +
                "FROM tracks_by_album " +
                "WHERE album_id = 201;"
            );
            System.out.println("+----------+---------+-----------------+--------------+-----+");
            System.out.printf("| %-8s | %-7s | %-15s | %-12s | %-3s |\n", 
                "track_no", "song_id", "song_title", "duration_min", "bpm");
            System.out.println("+----------+---------+-----------------+--------------+-----+");
            for (Row row : rs3) {
                int trackNo = row.getInt("track_no");
                int songId = row.getInt("song_id");
                String songTitle = row.getString("song_title");
                double durationMin = row.getDouble("duration_min");
                int bpm = row.getInt("bpm");
                System.out.printf("| %-8d | %-7d | %-15s | %-12.1f | %-3d |\n", 
                    trackNo, 
                    songId, 
                    songTitle != null ? "'" + songTitle + "'" : "null", 
                    durationMin, 
                    bpm);
            }
            System.out.println("+----------+---------+-----------------+--------------+-----+");
            System.out.println("========================================================================");
            
            // Q4: Gigs
            System.out.println("\n>>> Q4: Gigs of Band 1 (Sorted by Gig Date Desc) <<<");
            ResultSet rs4 = session.execute(
                "SELECT gig_date, gig_id, venue, ticket_price " +
                "FROM gigs_by_band " +
                "WHERE band_id = 1;"
            );
            System.out.println("+--------------+--------+------------------+--------------+");
            System.out.printf("| %-12s | %-6s | %-16s | %-12s |\n", 
                "gig_date", "gig_id", "venue", "ticket_price");
            System.out.println("+--------------+--------+------------------+--------------+");
            for (Row row : rs4) {
                LocalDate gigDate = row.getLocalDate("gig_date");
                int gigId = row.getInt("gig_id");
                String venue = row.getString("venue");
                double ticketPrice = row.getDouble("ticket_price");
                System.out.printf("| %-12s | %-6d | %-16s | %-12.0f |\n", 
                    gigDate != null ? "'" + gigDate + "'" : "null", 
                    gigId, 
                    venue != null ? "'" + venue + "'" : "null", 
                    ticketPrice);
            }
            System.out.println("+--------------+--------+------------------+--------------+");
            System.out.println("========================================================================");
            
            System.out.println("\nCassandra connection shut down.");
        } catch (Exception e) {
            System.err.println("Error connecting to Cassandra or running queries:");
            e.printStackTrace();
        }
    }
}
