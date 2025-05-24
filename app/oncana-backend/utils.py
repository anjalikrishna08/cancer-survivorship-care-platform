import re

def formatCarePlanToHTML(text: str) -> str:
    # Basic section headings
    text = re.sub(r'(?m)^([A-Z][a-z]+.*Plan.*?)$', r'<h2>\1</h2>', text)
    
    # Recommendations title
    text = re.sub(r'(?m)^Your Personalized Recommendations$', r'<h3>\1</h3>', text)
    
    # Bullet points
    text = text.replace('●', '<ul><li>').replace('○', '</li><li>')
    text = text.replace('\n', '<br>').replace('</li><li>', '</li><li>')
    text = text.replace('</li><br><ul><li>', '<ul><li>')  # clean nested

    # Closing any open tags
    if '<ul><li>' in text:
        text += '</li></ul>'

    return f"<div>{text}</div>"
