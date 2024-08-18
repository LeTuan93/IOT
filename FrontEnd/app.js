function showSection(sectionId) {
    // Hide all sections
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('sensor-data').style.display = 'none';
    document.getElementById('action-data').style.display = 'none';
    document.getElementById('profile-page').style.display = 'none';
    // Show the selected section
    document.getElementById(sectionId).style.display = 'block';
}