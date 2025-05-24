# care_plan_templates.py
import re


carePlanTagMap = {
    0: "Physical A",
    1: "Mental B",
    2: "Lifestyle C",
    3: "Combined D",
    4: "Social E",
    5: "Wellness F",
}

carePlanText = {
    "Physical A": """Physical Recovery Support Plan (Pathway A)

Title: Physical Health Recovery Support Plan

Dear {name},
Thank you for completing your care update. Based on your current responses, your care plan has been matched to the Physical A pathway — focusing on easing fatigue, managing pain, and rebuilding physical strength during cancer recovery. This plan is designed to support you with practical, step-by-step guidance for physical rehabilitation.

Your Personalized Recommendations

Gentle Physical Activity
● Purpose: Rebuild strength and reduce fatigue through consistent, light movement.
● What You Can Do:
○ Start Small: Begin with 5 minutes of light activity, like walking indoors or doing simple stretches while seated.
○ Progress Gradually: Once comfortable, add 1–2 minutes each day.
○ Incorporate Movement: Stretch during TV commercials or walk to a nearby mailbox.
● When: Aim for a brief movement session morning and evening.
● Why: Gentle activity boosts circulation and reduces stiffness.

Managing Fatigue Effectively
● Purpose: Address post-treatment fatigue by balancing activity and rest.
● What You Can Do:
○ Hydrate Regularly: Drink water throughout the day.
○ Balanced Meals: Include protein, whole grains, and vegetables.
○ Energy Conservation: Use the \"20-20 Rule\" — 20 minutes of light activity followed by 20 minutes of rest.
● When: Break daily tasks into manageable segments.
● Why: Hydration and diet support energy and recovery.

Pain Management Techniques
● Purpose: Reduce discomfort caused by stiffness or nerve pain.
● What You Can Do:
○ Heat Therapy: Warm compress for 10 minutes on stiff areas.
○ Cold Therapy: Cold pack on swollen areas for 5–10 minutes.
○ Gentle Stretching: Stretch sore muscles to relieve tightness.
● When: Morning, evening, or after activity.
● Why: Alternating therapies reduce inflammation and soreness.

Physiotherapy and Rehabilitation
● Purpose: Regain mobility and function post-treatment.
● What You Can Do:
○ Get a Referral: Ask for a cancer-trained physiotherapist.
○ Follow a Custom Plan: Tailored exercise routine.
○ Home Exercises: Arm circles, seated leg lifts, etc.
● Why: Guided rehab improves strength safely.

Final Reminder
Be kind to your body — it’s working hard to heal.
You’ve got this, and your care team is here to support you.
""",

    "Mental B": """Mental Health Care Plan (Pathway B)

Dear {name},
Thank you for completing your care update. Based on your current responses, your care plan has been matched to the Mental pathway — focusing on emotional well-being, managing anxiety and depression, and supporting mental resilience.

Your Personalized Recommendations

Talking Therapy (Counselling)
● Purpose: Process emotions and develop coping strategies.
● What You Can Do:
○ Speak to a counsellor with cancer recovery expertise.
○ Try Cognitive Behavioural Therapy (CBT).
● When: If emotions persist >2 weeks or disrupt daily life.
● How to Access: Get a referral via GP or oncologist.

Social Support and Connection
● Purpose: Reduce isolation and offer comfort.
● What You Can Do:
○ Join support groups (local or online).
○ Reconnect with friends or family.
● When: Aim for weekly support group, calls, or visits.
● Why: Conversations reduce emotional burden.

Mindfulness and Stress Management
● Purpose: Reduce stress and improve mood.
● Techniques:
○ Deep breathing (5–10 mins), guided imagery.
○ Progressive muscle relaxation.
● How to Start: Use guided videos and set up a quiet space.

Physical Activity for Mental Well-being
● Purpose: Boost mood and reduce anxiety.
● Activities: Light stretching, yoga, walks.
● How to Begin: Start with 5 mins, gradually increase.
● Why: Movement releases feel-good endorphins.

Final Reminder
Your mental health matters. Take one step at a time and reach out when needed. Your care team is with you.
""",

    "Lifestyle C": """Lifestyle Reform Support Plan (Pathway C)

Dear {name},
Thank you for completing your care update. Based on your current responses, your care plan has been matched to the Lifestyle pathway — focusing on promoting healthier post-cancer habits and reducing the risk of recurrence. This plan addresses dietary improvements, physical activity, and lifestyle changes to support long-term well-being.

Your Personalized Recommendations

Dietary Improvements
● Purpose: Improve nutrition for energy and immune support.
● What You Can Do:
○ Choose whole foods: fruits, vegetables, grains.
○ Reduce sugar and processed snacks.
○ Include lean proteins in every meal.
● Tip: Add one extra veggie to each meal.
● Why: Balanced diet supports recovery.

Smoking Cessation Support
● Purpose: Lower recurrence risk and improve lung health.
● What You Can Do:
○ Cut down slowly or use nicotine therapy.
○ Join a quit-smoking program or support group.
● Tip: Replace smoke breaks with walking.

Alcohol Moderation
● Purpose: Protect liver and reduce recurrence.
● What You Can Do:
○ Limit to 2 drinks/week.
○ Alternate with water.
○ Avoid keeping alcohol at home.
● Why: Lower intake = lower risk.

Physical Activity Routine
● Purpose: Boost mood and reduce fatigue.
● What You Can Do:
○ Start with 10 minutes daily — walk, swim, yoga.
○ Increase gradually and do what you enjoy.
● Tip: Walk to the corner and back daily.

Stress Reduction
● Purpose: Prevent relapse into harmful habits.
● What You Can Do:
○ Journal emotions, meditate, try calming hobbies.
● Tip: Replace screen time with creative tasks.

Final Reminder
Small daily changes build long-term health. You’ve got this.
""",

    "Combined D": """Dual-Focus Recovery Support Plan (Pathway D)

Dear {name},
Thank you for completing your care update. Based on your current responses, your care plan has been matched to the Dual-Focus pathway — supporting both physical and emotional recovery.

Your Personalized Recommendations

Mind-Body Integration
● Purpose: Address symptoms holistically.
● What You Can Do:
○ Yoga or walking meditation.
○ Pair deep breathing with movement.
● Why: Calms mind and body together.

Stress and Pain Management
● What You Can Do:
○ Use heat/cold packs on sore spots.
○ Try light massage or guided relaxation.
○ Express emotions via art or journaling.

Social and Emotional Support
● What You Can Do:
○ Attend peer groups or involve family in recovery.
○ Schedule regular social interactions.
● Why: Isolation worsens stress and pain.

Gentle Physical Activity
● What You Can Do:
○ Seated stretching, walking, resistance bands.
● Tip: A little daily movement > occasional heavy effort.

Mental Health Maintenance
● What You Can Do:
○ Gratitude journaling.
○ Maintain a simple daily routine.
○ Seek therapy when needed.

Final Reminder
Recovering physically and mentally takes time. Be kind to yourself. You’re not alone.
""",

    "Social E": """Social Support Care Plan (Pathway E)

Title: Social Support Recovery Plan

Dear {name},
Thank you for completing your care update. Based on your current responses, your care plan has been matched to the Social E pathway — focusing on strengthening your support network.

Your Personalized Recommendations

Build a Support Network
● Purpose: Emotional security and well-being.
● What You Can Do:
○ Share feelings with a trusted person.
○ Schedule weekly calls or visits.
○ Use video calls when needed.

Join Supportive Communities
● What You Can Do:
○ Local survivor meetups.
○ Online cancer forums.
○ Participate in hobby groups.

Communicate Needs
● What You Can Do:
○ Let loved ones know what helps or overwhelms.
○ Set healthy boundaries.

Strengthen Bonds
● What You Can Do:
○ Rekindle friendships.
○ Limit social media negativity.
○ Volunteer to feel connected.

Tips for Social Wellness
● Keep interactions regular and simple.
● Celebrate milestones with others.
● Say how you feel honestly.

Final Reminder
Social recovery is key. Every connection counts — even a smile or a message.
""",

    "Wellness F": """Wellness Care Plan (Pathway F)

Title: Wellness and Preventive Health Support Plan

Dear {name},
Thank you for completing your care update. Based on your current responses, your care plan has been matched to the Wellness F pathway — focused on long-term health.

Your Personalized Recommendations

Physical Activity
● Aim for 30 minutes of moderate daily activity.
● Add strength training twice a week.
● Stretch for flexibility.

Healthy Eating
● Eat whole foods and hydrate regularly.
● Avoid processed snacks.

Mindfulness
● Try guided meditation.
● Journal gratitude daily.

Social Engagement
● Volunteer or join hobby groups.
● Stay connected with family and friends.

Health Maintenance
● Attend regular checkups.
● Track symptoms.

Final Reminder
Consistency in self-care = sustained well-being. Keep going — your care team is proud of you.
"""
}
# HTML formatter for care plan rendering
def formatCarePlanToHTML(text: str) -> str:
    text = re.sub(r"(?m)^([A-Z][a-zA-Z\- ]+ Plan.*?)$", r"<h2>\1</h2>", text)
    text = re.sub(r"(?m)^Your Personalized Recommendations$", r"<h3>Your Personalized Recommendations</h3>", text)

    # Convert bullets to HTML lists
    text = text.replace('●', '<ul><li>')
    text = text.replace('○', '</li><li>')
    text = text.replace('·', '<ul><li>')
    text = re.sub(r"(?<!</li>)\n", r"<br>", text)  # Only replace standalone newlines

    if '<ul><li>' in text:
        text += '</li></ul>'

    return f"<div>{text}</div>"
