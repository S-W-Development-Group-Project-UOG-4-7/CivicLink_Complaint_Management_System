from ..models import Department

ROUTING_RULES = {
    Department.ELECTRICITY: [
        'electric', 'ceylon electricity board', 'power cut', 'transformer', 'street light', 'ceb'
    ],
    Department.WATER: [
        'water', 'nwsdb', 'pipe', 'leak', 'sewage', 'drainage'
    ],
    Department.POLICE: [
        'police', 'theft', 'robbery', 'harass', 'assault', 'crime', 'vandalism'
    ],
    Department.HEALTH: [
        'health', 'hospital', 'clinic', 'sanitation', 'garbage', 'mosquito'
    ],
    Department.MUNICIPAL: [
        'road', 'traffic', 'pothole', 'park', 'public', 'municipal', 'sidewalk'
    ],
}

CATEGORY_DEFAULTS = {
    'Electricity': Department.ELECTRICITY,
    'Water Supply': Department.WATER,
    'Public Safety': Department.POLICE,
    'Sanitation': Department.HEALTH,
    'Roads & Traffic': Department.MUNICIPAL,
    'Parks & Recreation': Department.MUNICIPAL,
}

def decide_department(category: str, title: str, description: str) -> str:
    if category in CATEGORY_DEFAULTS:
        return CATEGORY_DEFAULTS[category]
    text = f"{title} {description}".lower()
    for dept, keywords in ROUTING_RULES.items():
        if any(kw in text for kw in keywords):
            return dept
    return Department.MUNICIPAL
