// Theme Management
class ThemeManager {
  constructor() {
    this.theme = localStorage.getItem("theme") || "light"
    this.init()
  }

  init() {
    this.applyTheme()
    this.setupToggle()
  }

  applyTheme() {
    document.documentElement.setAttribute("data-theme", this.theme)
    this.updateToggleIcon()
  }

  updateToggleIcon() {
    const toggleBtn = document.getElementById("themeToggle")
    if (toggleBtn) {
      const icon = toggleBtn.querySelector("i")
      if (icon) {
        icon.className = this.theme === "dark" ? "fas fa-sun" : "fas fa-moon"
      }
    }
  }

  setupToggle() {
    const toggleBtn = document.getElementById("themeToggle")
    if (toggleBtn) {
      toggleBtn.addEventListener("click", () => this.toggle())
    }
  }

  toggle() {
    this.theme = this.theme === "light" ? "dark" : "light"
    localStorage.setItem("theme", this.theme)
    this.applyTheme()
  }
}

// Navigation Management
class NavigationManager {
  constructor() {
    this.init()
  }

  init() {
    this.setupMobileMenu()
    this.setupDropdowns()
    this.setupActiveLinks()
  }

  setupMobileMenu() {
    const hamburger = document.querySelector(".hamburger")
    const navMenu = document.querySelector(".nav-menu")

    if (hamburger && navMenu) {
      hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("active")
        navMenu.classList.toggle("active")
      })

      // Close menu when clicking on a link
      navMenu.querySelectorAll(".nav-link").forEach((link) => {
        link.addEventListener("click", () => {
          hamburger.classList.remove("active")
          navMenu.classList.remove("active")
        })
      })
    }
  }

  setupDropdowns() {
    const dropdowns = document.querySelectorAll(".dropdown")

    dropdowns.forEach((dropdown) => {
      const dropdownContent = dropdown.querySelector(".dropdown-content")

      dropdown.addEventListener("mouseenter", () => {
        dropdownContent.style.opacity = "1"
        dropdownContent.style.visibility = "visible"
        dropdownContent.style.transform = "translateY(0)"
      })

      dropdown.addEventListener("mouseleave", () => {
        dropdownContent.style.opacity = "0"
        dropdownContent.style.visibility = "hidden"
        dropdownContent.style.transform = "translateY(-10px)"
      })
    })
  }

  setupActiveLinks() {
    const currentPage = window.location.pathname.split("/").pop() || "index.html"
    const navLinks = document.querySelectorAll(".nav-link")

    navLinks.forEach((link) => {
      const href = link.getAttribute("href")
      if (href === currentPage) {
        link.classList.add("active")
      }
    })
  }
}

// Accordion Management
class AccordionManager {
  constructor() {
    this.init()
  }

  init() {
    this.setupAccordions()
    this.updateProgress()
  }

  setupAccordions() {
    const accordionHeaders = document.querySelectorAll(".accordion-header")

    accordionHeaders.forEach((header) => {
      header.addEventListener("click", () => {
        const accordionItem = header.parentElement
        const content = accordionItem.querySelector(".accordion-content")

        // Toggle active class
        accordionItem.classList.toggle("active")

        // Update max-height for smooth animation
        if (accordionItem.classList.contains("active")) {
          content.style.maxHeight = content.scrollHeight + "px"
        } else {
          content.style.maxHeight = "0"
        }

        this.updateProgress()
      })
    })
  }

  updateProgress() {
    const progressFill = document.getElementById("progressFill")
    if (!progressFill) return

    const totalSections = document.querySelectorAll(".accordion-item").length
    const activeSections = document.querySelectorAll(".accordion-item.active").length
    const progress = totalSections > 0 ? (activeSections / totalSections) * 100 : 0

    progressFill.style.width = `${progress}%`
  }
}

// Code Management
class CodeManager {
  constructor() {
    this.init()
  }

  init() {
    this.setupCopyButtons()
    this.highlightCode()
  }

  setupCopyButtons() {
    const copyButtons = document.querySelectorAll(".copy-btn")

    copyButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const codeBlock = button.closest(".code-block")
        const code = codeBlock.querySelector("pre code")

        if (code) {
          this.copyToClipboard(code.textContent)
          this.showCopyFeedback(button)
        }
      })
    })
  }

  async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text)
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea")
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
    }
  }

  showCopyFeedback(button) {
    const originalText = button.innerHTML
    button.innerHTML = '<i class="fas fa-check"></i> Copied!'
    button.style.backgroundColor = "#10b981"
    button.style.borderColor = "#10b981"

    setTimeout(() => {
      button.innerHTML = originalText
      button.style.backgroundColor = ""
      button.style.borderColor = ""
    }, 2000)
  }

  highlightCode() {
    // This would integrate with Prism.js for syntax highlighting
    const Prism = window.Prism // Declare Prism variable
    if (typeof Prism !== "undefined") {
      Prism.highlightAll()
    }
  }
}

// Scroll Management
class ScrollManager {
  constructor() {
    this.init()
  }

  init() {
    this.createScrollToTopButton()
    this.bindScrollEvents()
    this.updateTableOfContents()
  }

  createScrollToTopButton() {
    const button = document.createElement("button")
    button.className = "scroll-to-top"
    button.innerHTML = '<i class="fas fa-arrow-up"></i>'
    button.addEventListener("click", () => this.scrollToTop())
    document.body.appendChild(button)

    this.scrollToTopButton = button
  }

  bindScrollEvents() {
    let ticking = false

    window.addEventListener("scroll", () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          this.handleScroll()
          ticking = false
        })
        ticking = true
      }
    })
  }

  handleScroll() {
    const scrollY = window.scrollY

    // Show/hide scroll to top button
    if (scrollY > 300) {
      this.scrollToTopButton.classList.add("visible")
    } else {
      this.scrollToTopButton.classList.remove("visible")
    }

    // Update table of contents
    this.updateActiveSection()

    // Animate elements on scroll
    this.animateOnScroll()
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  updateActiveSection() {
    const sections = document.querySelectorAll(".content-section")
    const tocLinks = document.querySelectorAll(".toc a")

    let currentSection = ""

    sections.forEach((section) => {
      const rect = section.getBoundingClientRect()
      if (rect.top <= 100 && rect.bottom >= 100) {
        currentSection = section.id
      }
    })

    tocLinks.forEach((link) => {
      link.classList.remove("active")
      if (link.getAttribute("href") === `#${currentSection}`) {
        link.classList.add("active")
      }
    })
  }

  updateTableOfContents() {
    const tocLinks = document.querySelectorAll(".toc a")
    tocLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault()
        const targetId = link.getAttribute("href").substring(1)
        const targetElement = document.getElementById(targetId)

        if (targetElement) {
          const offsetTop = targetElement.offsetTop - 100
          window.scrollTo({
            top: offsetTop,
            behavior: "smooth",
          })
        }
      })
    })
  }

  animateOnScroll() {
    const elements = document.querySelectorAll(".fade-in, .slide-in-left, .slide-in-right")

    elements.forEach((element) => {
      const rect = element.getBoundingClientRect()
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0

      if (isVisible) {
        element.classList.add("visible")
      }
    })
  }
}

// Progress Tracking
class ProgressTracker {
  constructor() {
    this.storageKey = "cpp-mastery-progress"
    this.init()
  }

  init() {
    this.loadProgress()
    this.bindEvents()
  }

  loadProgress() {
    const saved = localStorage.getItem(this.storageKey)
    this.progress = saved ? JSON.parse(saved) : {}
  }

  saveProgress() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.progress))
  }

  markSectionComplete(sectionId) {
    const currentPage = window.location.pathname.split("/").pop() || "index.html"
    if (!this.progress[currentPage]) {
      this.progress[currentPage] = {}
    }
    this.progress[currentPage][sectionId] = true
    this.saveProgress()
    this.updateUI()
  }

  bindEvents() {
    const accordionHeaders = document.querySelectorAll(".accordion-header")
    accordionHeaders.forEach((header) => {
      header.addEventListener("click", () => {
        const sectionId = header.parentElement.querySelector(".content-section")?.id
        if (sectionId) {
          setTimeout(() => {
            this.markSectionComplete(sectionId)
          }, 1000) // Mark as complete after 1 second of viewing
        }
      })
    })
  }

  updateUI() {
    const currentPage = window.location.pathname.split("/").pop() || "index.html"
    const pageProgress = this.progress[currentPage] || {}

    // Update progress bar
    const totalSections = document.querySelectorAll(".content-section").length
    const completedSections = Object.keys(pageProgress).length
    const progressFill = document.getElementById("progressFill")

    if (progressFill && totalSections > 0) {
      const progress = (completedSections / totalSections) * 100
      progressFill.style.width = `${progress}%`
    }

    // Mark completed sections in TOC
    Object.keys(pageProgress).forEach((sectionId) => {
      const tocLink = document.querySelector(`.toc a[href="#${sectionId}"]`)
      if (tocLink) {
        tocLink.style.color = "var(--success-color)"
        tocLink.innerHTML += ' <i class="fas fa-check" style="font-size: 0.75rem;"></i>'
      }
    })
  }
}

// Search Functionality
class SearchManager {
  constructor() {
    this.init()
  }

  init() {
    this.createSearchBox()
    this.bindEvents()
  }

  createSearchBox() {
    const sidebar = document.querySelector(".sidebar-content")
    if (sidebar) {
      const searchBox = document.createElement("div")
      searchBox.className = "search-box"
      searchBox.innerHTML = `
                <input type="text" placeholder="Search topics..." class="search-input">
                <div class="search-results"></div>
            `
      sidebar.insertBefore(searchBox, sidebar.firstChild)
    }
  }

  bindEvents() {
    const searchInput = document.querySelector(".search-input")
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.performSearch(e.target.value)
      })
    }
  }

  performSearch(query) {
    const results = document.querySelector(".search-results")
    const tocLinks = document.querySelectorAll(".toc a")

    if (!query.trim()) {
      results.innerHTML = ""
      tocLinks.forEach((link) => (link.style.display = "block"))
      return
    }

    const matches = []
    tocLinks.forEach((link) => {
      const text = link.textContent.toLowerCase()
      if (text.includes(query.toLowerCase())) {
        matches.push(link)
        link.style.display = "block"
      } else {
        link.style.display = "none"
      }
    })

    if (matches.length === 0) {
      results.innerHTML =
        '<p style="color: var(--text-muted); font-size: 0.875rem; padding: 0.5rem;">No results found</p>'
    } else {
      results.innerHTML = ""
    }
  }
}

// Quiz Management
class QuizManager {
  constructor() {
    this.currentQuiz = null
    this.currentQuestion = 0
    this.answers = []
    this.startTime = null
    this.timer = null
    this.timeLimit = 0
    this.init()
  }

  init() {
    this.setupQuizData()
  }

  setupQuizData() {
    this.quizData = {
      basics: {
        title: "C++ Basics",
        timeLimit: 15 * 60, // 15 minutes in seconds
        questions: [
          {
            question: "Which of the following is the correct way to declare a variable in C++?",
            options: ["int x;", "variable int x;", "declare int x;", "int: x;"],
            correct: 0,
            explanation: "In C++, variables are declared by specifying the data type followed by the variable name.",
          },
          {
            question: "What is the output of the following code?",
            code: `#include <iostream>
using namespace std;

int main() {
    int x = 5;
    cout << x++ << " " << ++x << endl;
    return 0;
}`,
            options: ["5 6", "5 7", "6 7", "6 6"],
            correct: 1,
            explanation:
              "x++ returns the current value (5) then increments x to 6. ++x increments x to 7 then returns the new value (7).",
          },
          {
            question: "Which operator is used for dynamic memory allocation in C++?",
            options: ["malloc", "new", "alloc", "create"],
            correct: 1,
            explanation:
              "The 'new' operator is used for dynamic memory allocation in C++, while 'delete' is used for deallocation.",
          },
          {
            question: "What is the size of 'int' data type in most modern systems?",
            options: ["2 bytes", "4 bytes", "8 bytes", "It depends on the system"],
            correct: 3,
            explanation:
              "The size of 'int' is implementation-dependent, but it's typically 4 bytes on most modern 32-bit and 64-bit systems.",
          },
          {
            question: "Which of the following is NOT a valid C++ identifier?",
            options: ["_variable", "variable123", "123variable", "Variable_Name"],
            correct: 2,
            explanation: "C++ identifiers cannot start with a digit. They must start with a letter or underscore.",
          },
          {
            question: "What does the 'const' keyword do in C++?",
            options: ["Makes a variable constant", "Declares a function", "Creates a loop", "Defines a class"],
            correct: 0,
            explanation:
              "The 'const' keyword makes a variable constant, meaning its value cannot be changed after initialization.",
          },
          {
            question: "Which loop is guaranteed to execute at least once?",
            options: ["for loop", "while loop", "do-while loop", "None of the above"],
            correct: 2,
            explanation:
              "The do-while loop checks the condition after executing the loop body, so it always executes at least once.",
          },
          {
            question: "What is the correct syntax for a function declaration in C++?",
            options: ["function int myFunc();", "int myFunc();", "declare int myFunc();", "int function myFunc();"],
            correct: 1,
            explanation: "C++ function declarations follow the syntax: return_type function_name(parameters);",
          },
          {
            question: "Which header file is required for input/output operations?",
            options: ["<stdio.h>", "<iostream>", "<input.h>", "<output.h>"],
            correct: 1,
            explanation: "<iostream> is the standard C++ header for input/output operations, providing cin, cout, etc.",
          },
          {
            question: "What is the difference between '=' and '==' operators?",
            options: [
              "No difference",
              "'=' is assignment, '==' is comparison",
              "'=' is comparison, '==' is assignment",
              "Both are assignment operators",
            ],
            correct: 1,
            explanation:
              "'=' is the assignment operator used to assign values, while '==' is the equality comparison operator.",
          },
        ],
      },
      oop: {
        title: "Object-Oriented Programming",
        timeLimit: 20 * 60, // 20 minutes
        questions: [
          {
            question: "What is encapsulation in OOP?",
            options: [
              "Hiding implementation details",
              "Creating multiple objects",
              "Inheriting from parent class",
              "Overloading functions",
            ],
            correct: 0,
            explanation:
              "Encapsulation is the bundling of data and methods that operate on that data within a single unit, hiding internal implementation details.",
          },
          {
            question: "Which access modifier allows access only within the same class?",
            options: ["public", "protected", "private", "internal"],
            correct: 2,
            explanation: "The 'private' access modifier restricts access to members only within the same class.",
          },
          {
            question: "What is a constructor in C++?",
            options: [
              "A function that destroys objects",
              "A function that initializes objects",
              "A function that copies objects",
              "A function that compares objects",
            ],
            correct: 1,
            explanation:
              "A constructor is a special member function that is automatically called when an object is created to initialize it.",
          },
          {
            question: "What is the output of this code?",
            code: `class Base {
public:
    virtual void show() { cout << "Base"; }
};

class Derived : public Base {
public:
    void show() override { cout << "Derived"; }
};

int main() {
    Base* ptr = new Derived();
    ptr->show();
    return 0;
}`,
            options: ["Base", "Derived", "Compilation error", "Runtime error"],
            correct: 1,
            explanation:
              "Due to virtual function and polymorphism, the derived class's show() method is called, printing 'Derived'.",
          },
          {
            question: "What is inheritance in OOP?",
            options: [
              "Creating new classes from existing classes",
              "Hiding data members",
              "Overloading operators",
              "Creating multiple objects",
            ],
            correct: 0,
            explanation:
              "Inheritance allows creating new classes (derived classes) based on existing classes (base classes), inheriting their properties and methods.",
          },
          {
            question: "Which keyword is used to prevent inheritance of a class in C++11?",
            options: ["sealed", "final", "static", "const"],
            correct: 1,
            explanation:
              "The 'final' keyword (introduced in C++11) prevents a class from being inherited or a virtual function from being overridden.",
          },
          {
            question: "What is polymorphism?",
            options: [
              "Having multiple constructors",
              "Objects taking multiple forms",
              "Multiple inheritance",
              "Function overloading",
            ],
            correct: 1,
            explanation:
              "Polymorphism allows objects of different types to be treated as objects of a common base type, enabling them to take multiple forms.",
          },
          {
            question: "What is a pure virtual function?",
            options: [
              "A function with no implementation",
              "A function that cannot be overridden",
              "A function with multiple implementations",
              "A static function",
            ],
            correct: 0,
            explanation:
              "A pure virtual function is declared with '= 0' and has no implementation in the base class, making the class abstract.",
          },
          {
            question: "What is the purpose of a destructor?",
            options: [
              "To create objects",
              "To initialize objects",
              "To clean up resources when objects are destroyed",
              "To copy objects",
            ],
            correct: 2,
            explanation:
              "A destructor is called automatically when an object is destroyed to clean up resources and perform necessary cleanup operations.",
          },
          {
            question: "What is method overriding?",
            options: [
              "Having multiple methods with same name but different parameters",
              "Redefining a base class method in derived class",
              "Creating static methods",
              "Hiding base class methods",
            ],
            correct: 1,
            explanation:
              "Method overriding occurs when a derived class provides a specific implementation of a method that is already defined in its base class.",
          },
          {
            question: "What is abstraction in OOP?",
            options: [
              "Hiding complex implementation details",
              "Creating multiple objects",
              "Inheriting properties",
              "Overloading operators",
            ],
            correct: 0,
            explanation:
              "Abstraction involves hiding complex implementation details while showing only essential features of an object to the user.",
          },
          {
            question: "Which type of inheritance is NOT supported in C++?",
            options: [
              "Single inheritance",
              "Multiple inheritance",
              "Multilevel inheritance",
              "All types are supported",
            ],
            correct: 3,
            explanation:
              "C++ supports all types of inheritance: single, multiple, multilevel, hierarchical, and hybrid inheritance.",
          },
        ],
      },
      advanced: {
        title: "Advanced C++",
        timeLimit: 25 * 60, // 25 minutes
        questions: [
          {
            question: "What is a template in C++?",
            options: [
              "A predefined class",
              "A blueprint for creating generic functions or classes",
              "A type of inheritance",
              "A memory management technique",
            ],
            correct: 1,
            explanation:
              "Templates allow you to write generic code that works with different data types, creating a blueprint for functions or classes.",
          },
          {
            question: "What is the purpose of smart pointers?",
            options: [
              "To make pointers faster",
              "To automatically manage memory",
              "To create multiple pointers",
              "To hide pointer implementation",
            ],
            correct: 1,
            explanation:
              "Smart pointers automatically manage memory allocation and deallocation, helping prevent memory leaks and dangling pointers.",
          },
          {
            question: "Which smart pointer allows shared ownership?",
            options: ["unique_ptr", "shared_ptr", "weak_ptr", "auto_ptr"],
            correct: 1,
            explanation:
              "shared_ptr allows multiple pointers to share ownership of the same object, using reference counting for memory management.",
          },
          {
            question: "What is a lambda expression?",
            options: [
              "A type of loop",
              "An anonymous function",
              "A template specialization",
              "A memory allocation method",
            ],
            correct: 1,
            explanation:
              "Lambda expressions are anonymous functions that can be defined inline and used for short, simple operations.",
          },
          {
            question: "What does 'auto' keyword do in modern C++?",
            options: [
              "Makes variables automatic",
              "Automatically deduces the type",
              "Creates automatic destructors",
              "Enables automatic memory management",
            ],
            correct: 1,
            explanation:
              "The 'auto' keyword allows the compiler to automatically deduce the type of a variable from its initializer.",
          },
          {
            question: "What is move semantics?",
            options: [
              "Moving objects in memory",
              "Efficiently transferring resources from temporary objects",
              "Moving functions between classes",
              "Relocating variables",
            ],
            correct: 1,
            explanation:
              "Move semantics allows efficient transfer of resources from temporary objects, avoiding unnecessary copying.",
          },
          {
            question: "What is RAII?",
            options: [
              "Resource Acquisition Is Initialization",
              "Random Access Iterator Interface",
              "Runtime Automatic Interface Implementation",
              "Recursive Algorithm Implementation Interface",
            ],
            correct: 0,
            explanation:
              "RAII (Resource Acquisition Is Initialization) is a programming idiom where resource management is tied to object lifetime.",
          },
          {
            question: "What is the purpose of std::move?",
            options: [
              "To physically move objects in memory",
              "To cast an object to an rvalue reference",
              "To copy objects efficiently",
              "To delete objects",
            ],
            correct: 1,
            explanation:
              "std::move casts an object to an rvalue reference, enabling move semantics and efficient resource transfer.",
          },
          {
            question: "What is a variadic template?",
            options: [
              "A template with variable number of parameters",
              "A template that can vary its type",
              "A template with optional parameters",
              "A template that changes at runtime",
            ],
            correct: 0,
            explanation:
              "Variadic templates can accept a variable number of template parameters, enabling flexible generic programming.",
          },
          {
            question: "What is perfect forwarding?",
            options: [
              "Forwarding without any loss",
              "Preserving value category when forwarding arguments",
              "Forwarding to the perfect function",
              "Error-free forwarding",
            ],
            correct: 1,
            explanation:
              "Perfect forwarding preserves the value category (lvalue or rvalue) of arguments when forwarding them to other functions.",
          },
          {
            question: "What is constexpr?",
            options: [
              "A constant expression that can be evaluated at compile time",
              "A constant that never changes",
              "An expression that's always true",
              "A compile-time error",
            ],
            correct: 0,
            explanation:
              "constexpr indicates that a value or function can potentially be evaluated at compile time, enabling compile-time computations.",
          },
          {
            question: "What is the difference between std::unique_ptr and std::shared_ptr?",
            options: [
              "No difference",
              "unique_ptr allows exclusive ownership, shared_ptr allows shared ownership",
              "unique_ptr is faster, shared_ptr is safer",
              "unique_ptr is for single objects, shared_ptr is for arrays",
            ],
            correct: 1,
            explanation:
              "unique_ptr provides exclusive ownership of a resource, while shared_ptr allows multiple pointers to share ownership of the same resource.",
          },
          {
            question: "What is std::weak_ptr used for?",
            options: [
              "Weak references that don't affect object lifetime",
              "Pointers with weak type checking",
              "Pointers that are slower than regular pointers",
              "Pointers that can become null automatically",
            ],
            correct: 0,
            explanation:
              "std::weak_ptr provides a non-owning weak reference to an object managed by std::shared_ptr, helping break circular references.",
          },
          {
            question: "What is the purpose of std::forward?",
            options: [
              "To move objects forward in memory",
              "To implement perfect forwarding",
              "To forward declare functions",
              "To advance iterators",
            ],
            correct: 1,
            explanation:
              "std::forward is used to implement perfect forwarding, preserving the value category of arguments when forwarding them.",
          },
          {
            question: "What is a trailing return type?",
            options: [
              "A return type specified after the function parameters",
              "The last return statement in a function",
              "A return type that comes after the function body",
              "An optional return type",
            ],
            correct: 0,
            explanation:
              "Trailing return type syntax (auto func() -> return_type) allows specifying the return type after the parameter list, useful with templates.",
          },
        ],
      },
      stl: {
        title: "Standard Template Library",
        timeLimit: 18 * 60, // 18 minutes
        questions: [
          {
            question: "Which STL container provides constant time insertion and deletion at both ends?",
            options: ["vector", "list", "deque", "set"],
            correct: 2,
            explanation:
              "std::deque (double-ended queue) provides constant time insertion and deletion at both the front and back.",
          },
          {
            question: "What is the time complexity of finding an element in std::set?",
            options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
            correct: 1,
            explanation:
              "std::set is typically implemented as a balanced binary search tree, providing O(log n) search time.",
          },
          {
            question: "Which algorithm is used to sort elements in a container?",
            options: ["std::find", "std::sort", "std::search", "std::order"],
            correct: 1,
            explanation: "std::sort is the standard algorithm for sorting elements in a container using iterators.",
          },
          {
            question: "What does std::vector::push_back() do?",
            options: [
              "Adds element at the beginning",
              "Adds element at the end",
              "Removes last element",
              "Sorts the vector",
            ],
            correct: 1,
            explanation:
              "push_back() adds an element to the end of the vector, potentially reallocating memory if needed.",
          },
          {
            question: "Which container is best for frequent insertions and deletions in the middle?",
            options: ["vector", "deque", "list", "array"],
            correct: 2,
            explanation:
              "std::list (doubly-linked list) provides constant time insertion and deletion at any position.",
          },
          {
            question: "What is an iterator in STL?",
            options: [
              "A loop construct",
              "An object that points to elements in a container",
              "A sorting algorithm",
              "A memory allocator",
            ],
            correct: 1,
            explanation:
              "Iterators are objects that point to elements in containers and provide a way to traverse through them.",
          },
          {
            question: "Which function is used to find an element in a container?",
            options: ["std::search", "std::find", "std::locate", "std::get"],
            correct: 1,
            explanation:
              "std::find searches for an element in a range and returns an iterator to the first occurrence.",
          },
          {
            question: "What is the difference between std::map and std::unordered_map?",
            options: [
              "No difference",
              "map is ordered, unordered_map uses hash table",
              "map is faster, unordered_map uses more memory",
              "map allows duplicates, unordered_map doesn't",
            ],
            correct: 1,
            explanation:
              "std::map maintains elements in sorted order using a tree structure, while std::unordered_map uses a hash table for faster average access.",
          },
          {
            question: "What does std::accumulate do?",
            options: [
              "Sorts elements",
              "Finds maximum element",
              "Computes sum or applies binary operation to range",
              "Removes duplicates",
            ],
            correct: 2,
            explanation:
              "std::accumulate applies a binary operation (default is addition) to all elements in a range, returning the accumulated result.",
          },
          {
            question: "Which container automatically keeps elements sorted?",
            options: ["vector", "list", "set", "deque"],
            correct: 2,
            explanation: "std::set automatically maintains elements in sorted order and ensures uniqueness.",
          },
          {
            question: "What is the purpose of std::transform?",
            options: [
              "To change container type",
              "To apply a function to each element and store results",
              "To sort elements",
              "To remove elements",
            ],
            correct: 1,
            explanation:
              "std::transform applies a function to each element in a range and stores the results in another range.",
          },
          {
            question: "Which iterator type can move in both directions?",
            options: ["Input iterator", "Output iterator", "Forward iterator", "Bidirectional iterator"],
            correct: 3,
            explanation:
              "Bidirectional iterators can move both forward (++) and backward (--), like those used by std::list and std::set.",
          },
        ],
      },
    }
  }

  startQuiz(topic) {
    this.currentQuiz = this.quizData[topic]
    this.currentQuestion = 0
    this.answers = []
    this.startTime = Date.now()
    this.timeLimit = this.currentQuiz.timeLimit

    this.showQuizContent()
    this.displayQuestion()
    this.startTimer()
  }

  showQuizContent() {
    document.getElementById("quizSelection").style.display = "none"
    document.getElementById("quizContent").style.display = "block"
    document.getElementById("quizResults").style.display = "none"
  }

  displayQuestion() {
    const question = this.currentQuiz.questions[this.currentQuestion]
    const totalQuestions = this.currentQuiz.questions.length

    // Update progress
    document.getElementById("questionNumber").textContent = `Question ${this.currentQuestion + 1} of ${totalQuestions}`
    const progressFill = document.getElementById("quizProgressFill")
    progressFill.style.width = `${((this.currentQuestion + 1) / totalQuestions) * 100}%`

    // Display question
    document.getElementById("questionText").textContent = question.question

    // Display code snippet if present
    const codeSnippet = document.getElementById("codeSnippet")
    if (question.code) {
      codeSnippet.style.display = "block"
      document.getElementById("codeContent").textContent = question.code
    } else {
      codeSnippet.style.display = "none"
    }

    // Display options
    const optionsContainer = document.getElementById("optionsContainer")
    optionsContainer.innerHTML = ""

    question.options.forEach((option, index) => {
      const optionElement = document.createElement("div")
      optionElement.className = "option"
      optionElement.onclick = () => this.selectOption(index)

      optionElement.innerHTML = `
                <div class="option-letter">${String.fromCharCode(65 + index)}</div>
                <div class="option-text">${option}</div>
            `

      optionsContainer.appendChild(optionElement)
    })

    // Update navigation buttons
    document.getElementById("prevBtn").disabled = this.currentQuestion === 0

    const nextBtn = document.getElementById("nextBtn")
    const submitBtn = document.getElementById("submitBtn")

    if (this.currentQuestion === totalQuestions - 1) {
      nextBtn.style.display = "none"
      submitBtn.style.display = "inline-flex"
    } else {
      nextBtn.style.display = "inline-flex"
      submitBtn.style.display = "none"
    }

    // Restore previous answer if exists
    if (this.answers[this.currentQuestion] !== undefined) {
      this.selectOption(this.answers[this.currentQuestion], false)
    }
  }

  selectOption(index, animate = true) {
    // Remove previous selection
    document.querySelectorAll(".option").forEach((option) => {
      option.classList.remove("selected")
    })

    // Add selection to clicked option
    const options = document.querySelectorAll(".option")
    options[index].classList.add("selected")

    // Store answer
    this.answers[this.currentQuestion] = index

    if (animate) {
      options[index].style.transform = "scale(0.98)"
      setTimeout(() => {
        options[index].style.transform = "scale(1)"
      }, 150)
    }
  }

  nextQuestion() {
    if (this.currentQuestion < this.currentQuiz.questions.length - 1) {
      this.currentQuestion++
      this.displayQuestion()
    }
  }

  previousQuestion() {
    if (this.currentQuestion > 0) {
      this.currentQuestion--
      this.displayQuestion()
    }
  }

  startTimer() {
    const timerElement = document.getElementById("timer")
    let timeRemaining = this.timeLimit

    this.timer = setInterval(() => {
      const minutes = Math.floor(timeRemaining / 60)
      const seconds = timeRemaining % 60
      timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`

      if (timeRemaining <= 0) {
        this.submitQuiz()
        return
      }

      // Change color when time is running low
      if (timeRemaining <= 60) {
        timerElement.style.color = "var(--error-color)"
      } else if (timeRemaining <= 300) {
        timerElement.style.color = "var(--warning-color)"
      }

      timeRemaining--
    }, 1000)
  }

  submitQuiz() {
    clearInterval(this.timer)

    const endTime = Date.now()
    const timeTaken = Math.floor((endTime - this.startTime) / 1000)

    this.calculateResults(timeTaken)
    this.showResults()
  }

  calculateResults(timeTaken) {
    let correctAnswers = 0
    const totalQuestions = this.currentQuiz.questions.length

    this.currentQuiz.questions.forEach((question, index) => {
      if (this.answers[index] === question.correct) {
        correctAnswers++
      }
    })

    const percentage = Math.round((correctAnswers / totalQuestions) * 100)

    this.results = {
      correct: correctAnswers,
      incorrect: totalQuestions - correctAnswers,
      total: totalQuestions,
      percentage: percentage,
      timeTaken: timeTaken,
      grade: this.getGrade(percentage),
    }
  }

  getGrade(percentage) {
    if (percentage >= 90) return "A"
    if (percentage >= 80) return "B"
    if (percentage >= 70) return "C"
    if (percentage >= 60) return "D"
    return "F"
  }

  showResults() {
    document.getElementById("quizContent").style.display = "none"
    document.getElementById("quizResults").style.display = "block"

    // Update score circle
    const scoreCircle = document.querySelector(".score-circle")
    const percentage = this.results.percentage
    const degrees = (percentage / 100) * 360
    scoreCircle.style.background = `conic-gradient(var(--primary-color) 0deg, var(--primary-color) ${degrees}deg, var(--bg-tertiary) ${degrees}deg)`

    // Update score text
    document.getElementById("scorePercentage").textContent = `${percentage}%`

    // Update score message
    const scoreMessage = document.getElementById("scoreMessage")
    if (percentage >= 90) {
      scoreMessage.textContent = "Excellent! You have mastered this topic!"
    } else if (percentage >= 80) {
      scoreMessage.textContent = "Great job! You have a solid understanding!"
    } else if (percentage >= 70) {
      scoreMessage.textContent = "Good work! Keep practicing to improve!"
    } else if (percentage >= 60) {
      scoreMessage.textContent = "Not bad! Review the topics and try again!"
    } else {
      scoreMessage.textContent = "Keep studying! Practice makes perfect!"
    }

    // Update stats
    document.getElementById("correctAnswers").textContent = this.results.correct
    document.getElementById("incorrectAnswers").textContent = this.results.incorrect

    const minutes = Math.floor(this.results.timeTaken / 60)
    const seconds = this.results.timeTaken % 60
    document.getElementById("timeTaken").textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`

    // Show detailed breakdown
    this.showDetailedResults()
  }

  showDetailedResults() {
    const breakdown = document.getElementById("resultsBreakdown")
    breakdown.innerHTML = "<h3>Detailed Results</h3>"

    this.currentQuiz.questions.forEach((question, index) => {
      const userAnswer = this.answers[index]
      const isCorrect = userAnswer === question.correct

      const questionDiv = document.createElement("div")
      questionDiv.className = `question-result ${isCorrect ? "correct" : "incorrect"}`

      questionDiv.innerHTML = `
                <div class="question-header">
                    <span class="question-number">Q${index + 1}</span>
                    <span class="result-icon">${isCorrect ? "✓" : "✗"}</span>
                </div>
                <div class="question-text">${question.question}</div>
                <div class="answer-info">
                    <div class="user-answer">Your answer: ${userAnswer !== undefined ? question.options[userAnswer] : "Not answered"}</div>
                    <div class="correct-answer">Correct answer: ${question.options[question.correct]}</div>
                    <div class="explanation">${question.explanation}</div>
                </div>
            `

      breakdown.appendChild(questionDiv)
    })
  }

  retakeQuiz() {
    this.currentQuestion = 0
    this.answers = []
    this.showQuizContent()
    this.displayQuestion()
    this.startTimer()
  }

  backToTopics() {
    document.getElementById("quizResults").style.display = "none"
    document.getElementById("quizSelection").style.display = "block"

    // Reset timer display
    document.getElementById("timer").style.color = ""
  }

  shareResults() {
    const text = `I just scored ${this.results.percentage}% on the ${this.currentQuiz.title} quiz at C++ Mastery Hub! 🚀`

    if (navigator.share) {
      navigator.share({
        title: "C++ Quiz Results",
        text: text,
        url: window.location.href,
      })
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(text + " " + window.location.href).then(() => {
        alert("Results copied to clipboard!")
      })
    }
  }
}

// Utility Functions
function toggleAccordion(header) {
  const accordionItem = header.parentElement
  const content = accordionItem.querySelector(".accordion-content")

  accordionItem.classList.toggle("active")

  if (accordionItem.classList.contains("active")) {
    content.style.maxHeight = content.scrollHeight + "px"
  } else {
    content.style.maxHeight = "0"
  }

  // Update progress if accordion manager exists
  if (window.accordionManager) {
    window.accordionManager.updateProgress()
  }
}

function copyCode(button) {
  const codeBlock = button.closest(".code-block")
  const code = codeBlock.querySelector("pre code")

  if (code && window.codeManager) {
    window.codeManager.copyToClipboard(code.textContent)
    window.codeManager.showCopyFeedback(button)
  }
}

function startQuiz(topic) {
  if (window.quizManager) {
    window.quizManager.startQuiz(topic)
  }
}

function nextQuestion() {
  if (window.quizManager) {
    window.quizManager.nextQuestion()
  }
}

function previousQuestion() {
  if (window.quizManager) {
    window.quizManager.previousQuestion()
  }
}

function submitQuiz() {
  if (window.quizManager) {
    window.quizManager.submitQuiz()
  }
}

function retakeQuiz() {
  if (window.quizManager) {
    window.quizManager.retakeQuiz()
  }
}

function backToTopics() {
  if (window.quizManager) {
    window.quizManager.backToTopics()
  }
}

function shareResults() {
  if (window.quizManager) {
    window.quizManager.shareResults()
  }
}

// Animation Utilities
function animateOnScroll() {
  const elements = document.querySelectorAll(".feature-card, .path-item, .pillar-card, .component-card")

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("fade-in")
        }
      })
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    },
  )

  elements.forEach((element) => {
    observer.observe(element)
  })
}

// Smooth scrolling for anchor links
function setupSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
  })
}

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Initialize managers
  window.themeManager = new ThemeManager()
  window.navigationManager = new NavigationManager()
  window.accordionManager = new AccordionManager()
  window.codeManager = new CodeManager()
  window.quizManager = new QuizManager()

  // Setup additional features
  animateOnScroll()
  setupSmoothScrolling()

  // Add loading animation
  document.body.classList.add("fade-in")

  // Performance optimization: lazy load images
  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target
          img.src = img.dataset.src
          img.classList.remove("lazy")
          imageObserver.unobserve(img)
        }
      })
    })

    document.querySelectorAll("img[data-src]").forEach((img) => {
      imageObserver.observe(img)
    })
  }
})

// Handle page visibility changes
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    // Page is hidden, pause timers if quiz is active
    if (window.quizManager && window.quizManager.timer) {
      clearInterval(window.quizManager.timer)
    }
  } else {
    // Page is visible, resume timers if needed
    if (window.quizManager && window.quizManager.currentQuiz && !window.quizManager.timer) {
      window.quizManager.startTimer()
    }
  }
})

// Error handling
window.addEventListener("error", (e) => {
  console.error("JavaScript error:", e.error)
  // Could implement error reporting here
})

// Service Worker registration for offline functionality
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("ServiceWorker registration successful")
      })
      .catch((err) => {
        console.log("ServiceWorker registration failed")
      })
  })
}
