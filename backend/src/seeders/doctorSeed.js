const doctorData = (staffIds) => {
  // staffIds should be array of doctor staff IDs in order:
  // [cardiologist, general, pediatrician]

  const doctors = [
    // Cardiologist
    {
      staff: staffIds[0],
      licenseNumber: 'MD-CAR-123456',
      specialization: 'Cardiology',
      subSpecialization: ['Interventional Cardiology', 'Electrophysiology'],
      qualifications: [
        {
          degree: 'MBBS',
          institution: 'Harvard Medical School',
          year: 2005,
        },
        {
          degree: 'MD Cardiology',
          institution: 'Johns Hopkins University',
          year: 2010,
        },
        {
          degree: 'FACC',
          institution: 'American College of Cardiology',
          year: 2012,
        },
      ],
      experience: 15,
      registrationNumber: 'REG-CAR-001',
      registrationCouncil: 'American Medical Association',
      registrationYear: 2005,
      consultationFee: 200,
      followUpFee: 100,
      averageConsultationTime: 20,
      availableForEmergency: true,
      acceptingNewPatients: true,
      schedule: [
        {
          day: 'Monday',
          shifts: [
            {
              startTime: '09:00',
              endTime: '13:00',
              slotDuration: 20,
              maxPatients: 12,
            },
            {
              startTime: '14:00',
              endTime: '17:00',
              slotDuration: 20,
              maxPatients: 9,
            },
          ],
        },
        {
          day: 'Tuesday',
          shifts: [
            {
              startTime: '09:00',
              endTime: '13:00',
              slotDuration: 20,
              maxPatients: 12,
            },
          ],
        },
        {
          day: 'Wednesday',
          shifts: [
            {
              startTime: '09:00',
              endTime: '13:00',
              slotDuration: 20,
              maxPatients: 12,
            },
            {
              startTime: '14:00',
              endTime: '17:00',
              slotDuration: 20,
              maxPatients: 9,
            },
          ],
        },
        {
          day: 'Thursday',
          shifts: [
            {
              startTime: '09:00',
              endTime: '13:00',
              slotDuration: 20,
              maxPatients: 12,
            },
          ],
        },
        {
          day: 'Friday',
          shifts: [
            {
              startTime: '09:00',
              endTime: '13:00',
              slotDuration: 20,
              maxPatients: 12,
            },
          ],
        },
      ],
      leaves: [],
      rating: {
        average: 4.8,
        count: 156,
      },
      stats: {
        totalConsultations: 2450,
        totalSurgeries: 87,
        patientsServed: 1823,
      },
      awards: [
        {
          title: 'Best Cardiologist of the Year',
          year: 2022,
          organization: 'New York Medical Association',
        },
      ],
      publications: [
        {
          title: 'Advances in Interventional Cardiology',
          journal: 'American Journal of Cardiology',
          year: 2021,
          doi: '10.1016/j.amjcard.2021.01.001',
        },
      ],
      languages: ['English', 'Spanish'],
      signature: null,
      isAvailable: true,
    },
    // General Physician
    {
      staff: staffIds[1],
      licenseNumber: 'MD-GEN-234567',
      specialization: 'General Medicine',
      subSpecialization: [],
      qualifications: [
        {
          degree: 'MBBS',
          institution: 'Stanford University',
          year: 2007,
        },
        {
          degree: 'MD General Medicine',
          institution: 'University of Pennsylvania',
          year: 2012,
        },
      ],
      experience: 12,
      registrationNumber: 'REG-GEN-002',
      registrationCouncil: 'American Medical Association',
      registrationYear: 2007,
      consultationFee: 150,
      followUpFee: 75,
      averageConsultationTime: 15,
      availableForEmergency: true,
      acceptingNewPatients: true,
      schedule: [
        {
          day: 'Monday',
          shifts: [
            {
              startTime: '08:00',
              endTime: '12:00',
              slotDuration: 15,
              maxPatients: 16,
            },
            {
              startTime: '15:00',
              endTime: '18:00',
              slotDuration: 15,
              maxPatients: 12,
            },
          ],
        },
        {
          day: 'Tuesday',
          shifts: [
            {
              startTime: '08:00',
              endTime: '12:00',
              slotDuration: 15,
              maxPatients: 16,
            },
            {
              startTime: '15:00',
              endTime: '18:00',
              slotDuration: 15,
              maxPatients: 12,
            },
          ],
        },
        {
          day: 'Wednesday',
          shifts: [
            {
              startTime: '08:00',
              endTime: '12:00',
              slotDuration: 15,
              maxPatients: 16,
            },
          ],
        },
        {
          day: 'Thursday',
          shifts: [
            {
              startTime: '08:00',
              endTime: '12:00',
              slotDuration: 15,
              maxPatients: 16,
            },
            {
              startTime: '15:00',
              endTime: '18:00',
              slotDuration: 15,
              maxPatients: 12,
            },
          ],
        },
        {
          day: 'Friday',
          shifts: [
            {
              startTime: '08:00',
              endTime: '12:00',
              slotDuration: 15,
              maxPatients: 16,
            },
          ],
        },
        {
          day: 'Saturday',
          shifts: [
            {
              startTime: '09:00',
              endTime: '13:00',
              slotDuration: 15,
              maxPatients: 16,
            },
          ],
        },
      ],
      leaves: [],
      rating: {
        average: 4.6,
        count: 234,
      },
      stats: {
        totalConsultations: 3890,
        totalSurgeries: 0,
        patientsServed: 2567,
      },
      awards: [],
      publications: [],
      languages: ['English'],
      signature: null,
      isAvailable: true,
    },
    // Pediatrician
    {
      staff: staffIds[2],
      licenseNumber: 'MD-PED-345678',
      specialization: 'Pediatrics',
      subSpecialization: ['Neonatology'],
      qualifications: [
        {
          degree: 'MBBS',
          institution: 'Yale University',
          year: 2009,
        },
        {
          degree: 'MD Pediatrics',
          institution: 'Boston Children\'s Hospital',
          year: 2014,
        },
      ],
      experience: 10,
      registrationNumber: 'REG-PED-003',
      registrationCouncil: 'American Medical Association',
      registrationYear: 2009,
      consultationFee: 175,
      followUpFee: 85,
      averageConsultationTime: 20,
      availableForEmergency: false,
      acceptingNewPatients: true,
      schedule: [
        {
          day: 'Monday',
          shifts: [
            {
              startTime: '10:00',
              endTime: '14:00',
              slotDuration: 20,
              maxPatients: 12,
            },
          ],
        },
        {
          day: 'Tuesday',
          shifts: [
            {
              startTime: '10:00',
              endTime: '14:00',
              slotDuration: 20,
              maxPatients: 12,
            },
            {
              startTime: '15:00',
              endTime: '18:00',
              slotDuration: 20,
              maxPatients: 9,
            },
          ],
        },
        {
          day: 'Wednesday',
          shifts: [
            {
              startTime: '10:00',
              endTime: '14:00',
              slotDuration: 20,
              maxPatients: 12,
            },
          ],
        },
        {
          day: 'Thursday',
          shifts: [
            {
              startTime: '10:00',
              endTime: '14:00',
              slotDuration: 20,
              maxPatients: 12,
            },
          ],
        },
        {
          day: 'Friday',
          shifts: [
            {
              startTime: '10:00',
              endTime: '14:00',
              slotDuration: 20,
              maxPatients: 12,
            },
            {
              startTime: '15:00',
              endTime: '18:00',
              slotDuration: 20,
              maxPatients: 9,
            },
          ],
        },
      ],
      leaves: [],
      rating: {
        average: 4.9,
        count: 189,
      },
      stats: {
        totalConsultations: 2123,
        totalSurgeries: 0,
        patientsServed: 1567,
      },
      awards: [
        {
          title: 'Excellence in Pediatric Care',
          year: 2023,
          organization: 'New York Pediatric Society',
        },
      ],
      publications: [],
      languages: ['English', 'French'],
      signature: null,
      isAvailable: true,
    },
  ];

  return doctors;
};

module.exports = doctorData;
