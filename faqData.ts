export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqTopic {
  topic: string;
  description: string;
  questions: FaqItem[];
}

export const faqData: FaqTopic[] = [
  {
    topic: "About AMR",
    description: "Learn the basics of Antimicrobial Resistance.",
    questions: [
      {
        question: "What is Antimicrobial Resistance (AMR)?",
        answer: "Antimicrobial Resistance (AMR) is the ability of a microorganism (like bacteria, viruses, and some parasites) to stop an antimicrobial (such as antibiotics, antivirals, and antimalarials) from working against it. As a result, standard treatments become ineffective, infections persist, and may spread to others."
      },
      {
        question: "How does resistance develop?",
        answer: "Resistance is a natural evolutionary process. However, the misuse and overuse of antimicrobials in humans, animals, and agriculture are accelerating this process. When microbes are exposed to non-lethal doses of a drug, the surviving ones can develop resistance mechanisms, which they can then pass on to other microbes."
      },
      {
        question: "Why is AMR a global threat?",
        answer: "AMR makes common infections harder to treat, leading to longer illnesses, higher medical costs, and increased mortality. It threatens the effectiveness of modern medicine, including major surgery, cancer chemotherapy, and organ transplantation, which rely on effective antibiotics to prevent infections."
      }
    ]
  },
  {
    topic: "Responsible Antibiotic Use",
    description: "Understand how to use antibiotics correctly.",
    questions: [
      {
        question: "Should I take antibiotics for a cold or flu?",
        answer: "No. Colds and the flu are caused by viruses. Antibiotics are only effective against bacterial infections. Taking them for a viral illness will not help you get better and can contribute to the development of antibiotic resistance."
      },
      {
        question: "What does 'completing the full course' mean?",
        answer: "It means taking all the antibiotics prescribed by your doctor, exactly as instructed, even if you start to feel better. Stopping treatment early can allow some bacteria to survive and develop resistance."
      },
      {
        question: "Can I use leftover antibiotics?",
        answer: "No. Never use antibiotics that were prescribed for a previous illness or for someone else. The leftover medication may not be the right one for your current infection, and the dose may be incorrect. Always consult a healthcare professional."
      }
    ]
  },
  {
    topic: "The One Health Initiative",
    description: "Discover the collaborative approach to health.",
    questions: [
      {
        question: "What is the 'One Health' concept?",
        answer: "One Health is a collaborative, multisectoral approach that recognizes the deep interconnection between the health of people, animals, plants, and their shared environment. It aims to achieve optimal health outcomes by addressing health issues holistically."
      },
      {
        question: "How does One Health relate to AMR?",
        answer: "The same resistant bacteria can circulate in animals, humans, and the environment. Therefore, tackling AMR requires a coordinated One Health approach. This includes surveillance of resistance in both human and animal populations, promoting responsible antibiotic use in agriculture, and managing waste to prevent the spread of resistant germs."
      },
    ]
  }
];
