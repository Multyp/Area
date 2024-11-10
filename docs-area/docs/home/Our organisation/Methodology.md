# Agile Scrum Methodology

## 1. Agile Method Overview

Agile Scrum is an iterative and incremental approach to project management and software development that allows teams to deliver value to customers faster. Requirements, plans, and results are continuously evaluated, allowing the team to adapt quickly to change.

### 1.1. Key Concepts

- **Sprints**: Time-boxed iterations during which a deliverable (increment of the product) is completed. Typical sprint duration is 1–4 weeks.
- **Product Backlog**: A prioritized list of all features, enhancements, bug fixes, and technical work to be done in the project.
- **Sprint Backlog**: The set of product backlog items selected for the sprint, along with a plan for delivering them.
- **Increment**: The working product functionality delivered at the end of each sprint.
- **Feature Descriptions**: Since we don't have real users to provide User Stories, we'll use feature descriptions to outline the functionality we aim to build. These will replace User Stories in our process.

---

## 2. Roles in Agile Scrum

### 2.1. Product Owner

The Product Owner is responsible for defining the features of the product and prioritizing the product backlog. This role acts as the voice of the customer, ensuring that the team is delivering maximum value to the business.

**Responsibilities**:

- Managing and prioritizing the product backlog.
- Clearly expressing product backlog items.
- Ensuring that the backlog is visible and clear to all.
- Accepting or rejecting work completed by the team during the sprint.

### 2.2. Scrum Master

The Scrum Master is responsible for ensuring the team follows Scrum practices and processes. They act as a facilitator, ensuring smooth collaboration within the team and with external stakeholders.

**Responsibilities**:

- Coaching the team on Scrum principles and practices.
- Facilitating Scrum ceremonies (Daily Stand-ups, Sprint Planning, Sprint Review, Retrospective).
- Helping the team remove any blockers or obstacles.
- Ensuring the team remains focused and productive.

### 2.3. Development Team

The Development Team includes all team members who work on the product to deliver functional increments. This could include developers, designers, testers, and anyone else contributing to the sprint goals.

**Responsibilities**:

- Designing, developing, and testing the product increment.
- Estimating and committing to work during sprint planning.
- Organizing and managing their work to meet the sprint goal.
- Working collaboratively and transparently.

---

## 3. Detailed Sprint Planning Process for Your Project

### 3.1. Sprint Duration

For the IFTTT clone project, we will follow **2-week sprints**, which offer a balance between delivering small increments of value and having enough time for meaningful work.

### 3.2. Sprint Planning Meeting

The Sprint Planning meeting will be conducted at the start of each sprint. The meeting should last **1–2 hours**. Here's how the process should work:

### 3.2.1. Goals

- Define a clear **Sprint Goal** that describes what the team aims to achieve by the end of the sprint.
- Identify **Feature Descriptions** that the team will commit to achieving.

### 3.2.2. Task Breakdown

- Review the **Product Backlog** and select items based on priority and team capacity.
- **Break down each feature** into smaller tasks that are measurable and achievable within the sprint.

### 3.2.3. Assigning Story Points

- Assign **Story Points** to each feature, estimating its complexity and effort required (use Fibonacci sequence or T-shirt sizing).
- Ensure the total story points committed to the sprint are realistic given the team’s capacity.

Example of story points usage :

- https://atlassian.com/fr/agile/project-management/estimation

### 3.3. Daily Standups

Each day, the team will conduct a **15-minute Daily Stand-up** where each member answers:

- **What did I do yesterday?**
- **What will I do today?**
- **Are there any blockers?**

### 3.4. Sprint Review

At the end of the sprint, the team will hold a **Sprint Review** meeting to:

- Demonstrate the completed work (potentially shippable product increment).
- Get feedback from stakeholders or the Product Owner.
- Decide on the next steps or backlog adjustments based on the feedback.

### 3.5. Sprint Retrospective

Immediately after the Sprint Review, the team conducts a **Sprint Retrospective** to:

- Discuss what went well, what didn’t, and how to improve.
- Identify changes that can be applied to the next sprint.

---

## 4. Example Sprint Plan for IFTTT Clone Project

**Sprint Goal**: Create the basic authentication and service integration module for the IFTTT clone.

### Sprint Backlog:

1. **Feature Description**: "Enable users to log in using Google OAuth2."
    - **Tasks**:
        - Implement Google OAuth2 flow (5 story points)
        - Create a login page UI (3 story points)
        - Write unit tests for the authentication module (2 story points)

1. **Feature Description**: "Allow users to link their Twitter account."
    - **Tasks**:
        - Create Twitter integration API (5 story points)
        - Develop UI for Twitter account linking (3 story points)
        - Write unit tests for Twitter integration (2 story points)

### Total Story Points for Sprint: 20

### Daily Standups:

- **Duration**: 15 minutes.
- **Participants**: All team members.
- **Focus**: Progress, upcoming tasks, blockers.

---

## 5. Definition of Done (DoD)

The **Definition of Done** ensures that all items selected for the sprint meet certain quality standards and are truly complete before they can be marked as "done." For our project, an item is considered done when:

1. **All tasks related to the feature are completed**.
2. The feature has been **tested** and meets the acceptance criteria. (task-specific, can be discussed for task that don’t need unit tests)
3. The code has been **peer-reviewed** and approved by at least one other team member.
4. The feature is **integrated into the main branch** without any merge conflicts.
5. **All necessary documentation** (code comments, project docs, user guides) is up-to-date.
6. The feature works in the **target environment** (development or production).
7. **No known bugs** related to the feature remain unresolved.
8. The feature is demonstrated and **approved** by the Product Owner during the Sprint Review.

---

## 6. Backlog Grooming

**Frequency**: Once per week for 30 minutes to 1 hour.

**Goal**: Ensure the backlog is properly refined for the upcoming sprints.

- Remove outdated or irrelevant items.
- Add new features, bugs, or tasks.
- Estimate and prioritize backlog items for future sprints.

---

## 7. Agile Scrum Ceremony Recap

- **Sprint Planning**: Start of the sprint (2 weeks), 1–2 hours.
- **Daily Standups**: Every day, 15 minutes.
- **Sprint Review**: End of the sprint (2 weeks), demonstrate the increment.
- **Sprint Retrospective**: End of the sprint, discuss improvements.

---