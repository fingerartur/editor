# Enhancers

- tehy implement GUI popups for editing Element types and SVG rendering

# Why enhancers? why not just add rendering functionality to Element classes?

- Element classes are the logic, the should not know that there is any graphical part of the application at all
- enhancers are a compromise
  - the graphical knowledge is decoupled from Element classes
  - but I can still use dynamic polymorphism to make rendering simple code independent of the knowledge of concrete Element classes