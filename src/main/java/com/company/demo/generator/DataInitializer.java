package com.company.demo.generator;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.company.demo.entity.Author;
import com.company.demo.entity.Book;
import com.company.demo.entity.User;
import com.company.demo.repository.AuthorRepository;
import com.company.demo.repository.BookRepository;
import com.company.demo.repository.UserRepository;

@Component
public class DataInitializer implements CommandLineRunner {

	@Autowired
	private AuthorRepository authorRepository;

	@Autowired
	private BookRepository bookRepository;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Override
	public void run(String... args) throws Exception {
		if (userRepository.count() == 0) {
			// Create Default Admin
			User admin = User.builder()
					.username("admin")
					.password(passwordEncoder.encode("admin123"))
					.userRole("ROLE_ADMIN")
					.build();
			userRepository.save(admin);

			// Create Default User
			User user = User.builder()
					.username("user")
					.password(passwordEncoder.encode("user123"))
					.userRole("ROLE_USER")
					.build();
			userRepository.save(user);

			// Create Sample Authors
			Author author1 = Author.builder()
					.authorName("J.K. Rowling")
					.authorEmail("jkrowling@example.com")
					.books(new ArrayList<>())
					.build();
			
			Author author2 = Author.builder()
					.authorName("George R.R. Martin")
					.authorEmail("grrmartin@example.com")
					.books(new ArrayList<>())
					.build();

			Author author3 = Author.builder()
					.authorName("J.R.R. Tolkien")
					.authorEmail("jrrtolkien@example.com")
					.books(new ArrayList<>())
					.build();

			authorRepository.save(author1);
			authorRepository.save(author2);
			authorRepository.save(author3);

			// Create Sample Books
			List<Author> authors1 = new ArrayList<>();
			authors1.add(author1);
			Book book1 = Book.builder()
					.bookName("Harry Potter and the Sorcerer's Stone")
					.bookImage("https://images-na.ssl-images-amazon.com/images/I/81iqZ2HHD-L.jpg")
					.pageCount(309L)
					.price(599.0)
					.stock(50L)
					.authors(authors1)
					.build();

			List<Author> authors2 = new ArrayList<>();
			authors2.add(author2);
			Book book2 = Book.builder()
					.bookName("A Game of Thrones")
					.bookImage("https://images-na.ssl-images-amazon.com/images/I/91dSMuGo8vL.jpg")
					.pageCount(694L)
					.price(799.0)
					.stock(30L)
					.authors(authors2)
					.build();

			List<Author> authors3 = new ArrayList<>();
			authors3.add(author3);
			Book book3 = Book.builder()
					.bookName("The Hobbit")
					.bookImage("https://images-na.ssl-images-amazon.com/images/I/710+HcoP38L.jpg")
					.pageCount(310L)
					.price(499.0)
					.stock(100L)
					.authors(authors3)
					.build();

			bookRepository.save(book1);
			bookRepository.save(book2);
			bookRepository.save(book3);

			System.out.println("----- Sample Data Initialized -----");
		}
	}
}
