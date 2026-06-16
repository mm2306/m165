package ch.tbz.kn03;

import org.neo4j.driver.AuthTokens;
import org.neo4j.driver.Driver;
import org.neo4j.driver.GraphDatabase;
import org.neo4j.driver.Record;
import org.neo4j.driver.Result;
import org.neo4j.driver.Session;

public class Neo4jApp {

    private static final String URI = "bolt://localhost:7688";
    private static final String USER = "neo4j";
    private static final String PASSWORD = "testpassword";

    public static void main(String[] args) {
        System.out.println("Connecting to Neo4j database at " + URI + "...");
        
        try (Driver driver = GraphDatabase.driver(URI, AuthTokens.basic(USER, PASSWORD))) {
            
            // Verify connection
            driver.verifyConnectivity();
            System.out.println("Connection successful!");

            try (Session session = driver.session()) {
                
                // 1. Clear existing database to ensure a clean state
                System.out.println("Clearing existing database nodes and relationships...");
                session.executeWrite(tx -> {
                    tx.run("MATCH (n) DETACH DELETE n");
                    return null;
                });

                // 2. Insert test data (Band-Projekt from KN-N-01 / KN-M-03)
                System.out.println("Inserting musician, band, song, album and gig nodes with relationships...");
                session.executeWrite(tx -> {
                    String createQuery = 
                        "CREATE " +
                        "  (m1:Musician {musicianId: 'm1', stageName: 'Jimmy Page', mainInstrumentCode: 'G', email: 'jimmy.page@ledzeppelin.com'}), " +
                        "  (m2:Musician {musicianId: 'm2', stageName: 'Robert Plant', mainInstrumentCode: 'V', email: 'robert.plant@ledzeppelin.com'}), " +
                        "  (m3:Musician {musicianId: 'm3', stageName: 'John Paul Jones', mainInstrumentCode: 'B', email: 'jpj@ledzeppelin.com'}), " +
                        "  (m4:Musician {musicianId: 'm4', stageName: 'John Bonham', mainInstrumentCode: 'D', email: 'bonzo@ledzeppelin.com'}), " +
                        "  (m5:Musician {musicianId: 'm5', stageName: 'Freddie Mercury', mainInstrumentCode: 'V', email: 'freddie@queen.com'}), " +
                        "   " +
                        "  (b1:Band {bandId: 'b1', name: 'Led Zeppelin', formedDate: date('1968-09-01'), genre: 'Hard Rock'}), " +
                        "  (b2:Band {bandId: 'b2', name: 'Queen', formedDate: date('1970-06-01'), genre: 'Rock'}), " +
                        "  (b3:Band {bandId: 'b3', name: 'The Who', formedDate: date('1964-01-01'), genre: 'Rock'}), " +
                        "   " +
                        "  (s1:Song {songId: 's1', title: 'Stairway to Heaven', durationMin: 8.02, bpm: 73}), " +
                        "  (s2:Song {songId: 's2', title: 'Whole Lotta Love', durationMin: 5.34, bpm: 90}), " +
                        "  (s3:Song {songId: 's3', title: 'Kashmir', durationMin: 8.28, bpm: 80}), " +
                        "  (s4:Song {songId: 's4', title: 'Bohemian Rhapsody', durationMin: 5.55, bpm: 72}), " +
                        "  (s5:Song {songId: 's5', title: 'Another One Bites the Dust', durationMin: 3.35, bpm: 110}), " +
                        "  (s6:Song {songId: 's6', title: 'We Will Rock You', durationMin: 2.01, bpm: 81}), " +
                        "   " +
                        "  (a1:Album {albumId: 'a1', title: 'Led Zeppelin IV', releaseDate: date('1971-11-08'), format: 'LP'}), " +
                        "  (a2:Album {albumId: 'a2', title: 'Led Zeppelin II', releaseDate: date('1969-10-22'), format: 'LP'}), " +
                        "  (a3:Album {albumId: 'a3', title: 'A Night at the Opera', releaseDate: date('1975-11-21'), format: 'LP'}), " +
                        "  (a4:Album {albumId: 'a4', title: 'The Game', releaseDate: date('1980-06-30'), format: 'LP'}), " +
                        "   " +
                        "  (g1:Gig {gigId: 'g1', venue: 'Madison Square Garden', date: date('1973-07-27'), ticketPrice: 7.50}), " +
                        "  (g2:Gig {gigId: 'g2', venue: 'Wembley Stadium', date: date('1986-07-12'), ticketPrice: 14.50}), " +
                        "  (g3:Gig {gigId: 'g3', venue: 'Royal Albert Hall', date: date('1970-01-09'), ticketPrice: 3.00}), " +
                        "   " +
                        "  (m1)-[:IS_MEMBER_OF {role: 'Guitarist', joinedDate: date('1968-09-01')}]->(b1), " +
                        "  (m2)-[:IS_MEMBER_OF {role: 'Vocalist', joinedDate: date('1968-09-01')}]->(b1), " +
                        "  (m3)-[:IS_MEMBER_OF {role: 'Bassist', joinedDate: date('1968-09-01')}]->(b1), " +
                        "  (m4)-[:IS_MEMBER_OF {role: 'Drummer', joinedDate: date('1968-09-01')}]->(b1), " +
                        "  (m5)-[:IS_MEMBER_OF {role: 'Lead Vocalist', joinedDate: date('1970-06-01')}]->(b2), " +
                        "   " +
                        "  (s1)-[:PERFORMED_BY]->(b1), " +
                        "  (s2)-[:PERFORMED_BY]->(b1), " +
                        "  (s3)-[:PERFORMED_BY]->(b1), " +
                        "  (s4)-[:PERFORMED_BY]->(b2), " +
                        "  (s5)-[:PERFORMED_BY]->(b2), " +
                        "  (s6)-[:PERFORMED_BY]->(b2), " +
                        "   " +
                        "  (a1)-[:INCLUDES {trackNo: 4, isBonus: false}]->(s1), " +
                        "  (a2)-[:INCLUDES {trackNo: 1, isBonus: false}]->(s2), " +
                        "  (a3)-[:INCLUDES {trackNo: 11, isBonus: false}]->(s4), " +
                        "  (a4)-[:INCLUDES {trackNo: 3, isBonus: false}]->(s5), " +
                        "   " +
                        "  (b1)-[:PERFORMED_AT]->(g1), " +
                        "  (b1)-[:PERFORMED_AT]->(g3), " +
                        "  (b2)-[:PERFORMED_AT]->(g2)";
                    tx.run(createQuery);
                    return null;
                });
                System.out.println("Data successfully inserted!");

                // 3. Query the data: Find songs performed by Led Zeppelin
                System.out.println("\nQuerying: Songs performed by Led Zeppelin...");
                session.executeRead(tx -> {
                    Result result = tx.run(
                        "MATCH (s:Song)-[:PERFORMED_BY]->(b:Band {name: 'Led Zeppelin'}) " +
                        "RETURN s.title AS title, s.durationMin AS duration " +
                        "ORDER BY s.title"
                    );
                    
                    while (result.hasNext()) {
                        Record record = result.next();
                        String title = record.get("title").asString();
                        double duration = record.get("duration").asDouble();
                        System.out.printf(" - %s (%.2f min)\n", title, duration);
                    }
                    return null;
                });
            }
            
        } catch (Exception e) {
            System.err.println("An error occurred during database operations:");
            e.printStackTrace();
        }
        
        System.out.println("\nExecution complete.");
    }
}
