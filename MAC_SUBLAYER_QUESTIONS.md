# MAC Sublayer Questions - Three Cases

This document clarifies the three variations of the MAC sublayer question (Questions 2, 3, and 4).

## Question 2 - **Case A**

**Question:** Which two functions are performed at the MAC sublayer of the OSI Data Link Layer to facilitate Ethernet communication?

**Correct Answers:**
- ✅ **A.** applies delimiting of Ethernet frame fields to synchronize communication between nodes
- ✅ **B.** applies source and destination MAC addresses to Ethernet frame

**Other Options:**
- ❌ C. places information in the Ethernet frame that identifies which network layer protocol is being encapsulated by the frame
- ❌ D. handles communication between upper layer networking software and Ethernet NIC hardware
- ❌ E. adds Ethernet control information to network protocol data

---

## Question 3 - **Case B**

**Question:** Which two functions are performed at the MAC sublayer of the OSI Data Link Layer to facilitate Ethernet communication?

**Correct Answers:**
- ✅ **A.** implements a process to delimit fields within an Ethernet 2 frame
- ✅ **B.** implements trailer with frame check sequence for error detection

**Other Options:**
- ❌ C. handles communication between upper layer networking software and Ethernet NIC hardware
- ❌ D. adds Ethernet control information to network protocol data
- ❌ E. places information in the Ethernet frame that identifies which network layer protocol is being encapsulated by the frame

---

## Question 4 - **Case C**

**Question:** Which two functions are performed at the MAC sublayer of the OSI Data Link Layer to facilitate Ethernet communication?

**Correct Answers:**
- ✅ **A.** implements CSMA/CD over legacy shared half-duplex media
- ✅ **B.** integrates Layer 2 flows between 10 Gigabit Ethernet over fiber and 1 Gigabit Ethernet over copper

**Other Options:**
- ❌ C. handles communication between upper layer networking software and Ethernet NIC hardware
- ❌ D. adds Ethernet control information to network protocol data
- ❌ E. enables IPv4 and IPv6 to utilize the same physical medium

---

## Visual Identification

In the quiz interface, each question displays a **case tag** in the header:
- Question 2: Shows **"Case A"** tag
- Question 3: Shows **"Case B"** tag  
- Question 4: Shows **"Case C"** tag

The case tags are styled with an accent color (purple/blue) to make them easily distinguishable from the question type tag ("Choose 2").

## Implementation Details

- **File locations:**
  - `src/questions/Question2.astro` - Case A
  - `src/questions/Question3.astro` - Case B
  - `src/questions/Question4.astro` - Case C

- **Correct answers in script.js:**
  - Question 2 (index 1): `[0, 1]` - Options A and B
  - Question 3 (index 2): `[0, 1]` - Options A and B
  - Question 4 (index 3): `[0, 1]` - Options A and B

All three questions require selecting exactly 2 answers, and in each case, the correct answers are options A and B (indices 0 and 1).
