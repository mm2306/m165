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

                // 2. Insert test data
                System.out.println("Inserting movie and person nodes with relationships...");
                session.executeWrite(tx -> {
                    String createQuery = 
                        "CREATE " +
                        "  (m1:Movie {title: 'The Matrix', released: 1999, tagline: 'Welcome to the Real World'}), " +
                        "  (m2:Movie {title: 'Inception', released: 2010, tagline: 'Your mind is the scene of the crime'}), " +
                        "  (m3:Movie {title: 'Interstellar', released: 2014, tagline: 'Mankind was born on Earth. It was never meant to die here.'}), " +
                        "  (m4:Movie {title: 'The Dark Knight', released: 2008, tagline: 'Why So Serious?'}), " +
                        "   " +
                        "  (p1:Person {name: 'Keanu Reeves', born: 1964}), " +
                        "  (p2:Person {name: 'Carrie-Anne Moss', born: 1967}), " +
                        "  (p3:Person {name: 'Leonardo DiCaprio', born: 1974}), " +
                        "  (p4:Person {name: 'Matthew McConaughey', born: 1969}), " +
                        "  (p5:Person {name: 'Christopher Nolan', born: 1970}), " +
                        "  (p6:Person {name: 'Christian Bale', born: 1974}), " +
                        "   " +
                        "  (p1)-[:ACTED_IN {roles: ['Neo']}]->(m1), " +
                        "  (p2)-[:ACTED_IN {roles: ['Trinity']}]->(m1), " +
                        "  (p3)-[:ACTED_IN {roles: ['Cobb']}]->(m2), " +
                        "  (p5)-[:DIRECTED]->(m2), " +
                        "  (p4)-[:ACTED_IN {roles: ['Cooper']}]->(m3), " +
                        "  (p5)-[:DIRECTED]->(m3), " +
                        "  (p6)-[:ACTED_IN {roles: ['Bruce Wayne']}]->(m4), " +
                        "  (p5)-[:DIRECTED]->(m4)";
                    tx.run(createQuery);
                    return null;
                });
                System.out.println("Data successfully inserted!");

                // 3. Query the data: Find movies directed by Christopher Nolan
                System.out.println("\nQuerying: Movies directed by Christopher Nolan...");
                session.executeRead(tx -> {
                    Result result = tx.run(
                        "MATCH (p:Person {name: 'Christopher Nolan'})-[:DIRECTED]->(m:Movie) " +
                        "RETURN m.title AS title, m.released AS released " +
                        "ORDER BY m.released DESC"
                    );
                    
                    while (result.hasNext()) {
                        Record record = result.next();
                        String title = record.get("title").asString();
                        int released = record.get("released").asInt();
                        System.out.printf(" - %s (%d)\n", title, released);
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
