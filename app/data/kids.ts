export interface KidParent {
  name: string;
  role: "Mamá" | "Papá";
  initial: string;
  avatarColor: string;
  status: "active" | "pending";
}

export interface Kid {
  id: string;
  name: string;
  initial: string;
  avatarBg: string;
  avatarColor: string;
  age: string;
  parentsLinked: number;
  parentsLabel: string;
  tag?: string;
  tagBg?: string;
  tagColor?: string;
  allergies?: string;
  birthDate: string;
  room: string;
  joinDate: string;
  parents: KidParent[];
}

export const kids: Kid[] = [
  {
    id: "mateo-fernandez",
    name: "Mateo Fernández",
    initial: "M",
    avatarBg: "#A9D9E8",
    avatarColor: "#1F7A93",
    age: "3 años",
    parentsLinked: 2,
    parentsLabel: "2 padres vinculados",
    tag: "MANÍ",
    tagBg: "#FBD8CC",
    tagColor: "#D9684A",
    allergies:
      "Alergia al maní. Evitar frutos secos. Lleva inhalador en la mochila.",
    birthDate: "12 mar 2022",
    room: "Soles",
    joinDate: "feb 2025",
    parents: [
      { name: "Lucía Fernández", role: "Mamá", initial: "L", avatarColor: "#C9B6E8", status: "active" },
      { name: "Diego Fernández", role: "Papá", initial: "D", avatarColor: "#A9C7E8", status: "pending" },
    ],
  },
  {
    id: "sofia-mendez",
    name: "Sofía Méndez",
    initial: "S",
    avatarBg: "#F4B8CC",
    avatarColor: "#C44A7A",
    age: "2 años",
    parentsLinked: 1,
    parentsLabel: "1 padre vinculado",
    allergies: "Sin alergias conocidas.",
    birthDate: "20 jul 2023",
    room: "Soles",
    joinDate: "mar 2025",
    parents: [
      { name: "Carla Méndez", role: "Mamá", initial: "C", avatarColor: "#F4B8CC", status: "active" },
    ],
  },
  {
    id: "benjamin-ruiz",
    name: "Benjamín Ruiz",
    initial: "B",
    avatarBg: "#B9DEC4",
    avatarColor: "#3E8B62",
    age: "3 años",
    parentsLinked: 2,
    parentsLabel: "2 padres vinculados",
    allergies: "Alergia al polvo. Ventilar el aula regularmente.",
    birthDate: "5 nov 2022",
    room: "Soles",
    joinDate: "ene 2025",
    parents: [
      { name: "Martín Ruiz", role: "Papá", initial: "M", avatarColor: "#B9DEC4", status: "active" },
      { name: "Paula Ruiz", role: "Mamá", initial: "P", avatarColor: "#A9D9E8", status: "active" },
    ],
  },
  {
    id: "valentina-soto",
    name: "Valentina Soto",
    initial: "V",
    avatarBg: "#F4DC8E",
    avatarColor: "#9A7B1E",
    age: "2 años",
    parentsLinked: 0,
    parentsLabel: "sin padres vinculados",
    tag: "VINCULAR",
    tagBg: "#F9D2DE",
    tagColor: "#C56486",
    allergies: "Sin alergias conocidas.",
    birthDate: "14 abr 2023",
    room: "Soles",
    joinDate: "jun 2025",
    parents: [],
  },
  {
    id: "tomas-diaz",
    name: "Tomás Díaz",
    initial: "T",
    avatarBg: "#C9B6E8",
    avatarColor: "#7B5FC0",
    age: "3 años",
    parentsLinked: 1,
    parentsLabel: "1 padre vinculado",
    tag: "LACTOSA",
    tagBg: "#FBD8CC",
    tagColor: "#D9684A",
    allergies: "Intolerancia a la lactosa. Leche sin lactosa.",
    birthDate: "30 ene 2022",
    room: "Soles",
    joinDate: "feb 2025",
    parents: [
      { name: "Natalia Díaz", role: "Mamá", initial: "N", avatarColor: "#F4DC8E", status: "active" },
    ],
  },
  {
    id: "emma-castro",
    name: "Emma Castro",
    initial: "E",
    avatarBg: "#F4B8CC",
    avatarColor: "#C44A7A",
    age: "2 años",
    parentsLinked: 1,
    parentsLabel: "1 padre vinculado",
    allergies: "Alergia al gluten. Dieta sin TACC.",
    birthDate: "8 sep 2023",
    room: "Soles",
    joinDate: "abr 2025",
    parents: [
      { name: "Ignacio Castro", role: "Papá", initial: "I", avatarColor: "#C9B6E8", status: "active" },
    ],
  },
  {
    id: "lucas-romero",
    name: "Lucas Romero",
    initial: "L",
    avatarBg: "#A9D9E8",
    avatarColor: "#1F7A93",
    age: "3 años",
    parentsLinked: 1,
    parentsLabel: "1 padre vinculado",
    allergies: "Sin alergias conocidas.",
    birthDate: "17 jun 2022",
    room: "Soles",
    joinDate: "ene 2025",
    parents: [
      { name: "Soledad Romero", role: "Mamá", initial: "S", avatarColor: "#B9DEC4", status: "active" },
    ],
  },
  {
    id: "olivia-vega",
    name: "Olivia Vega",
    initial: "O",
    avatarBg: "#B9DEC4",
    avatarColor: "#3E8B62",
    age: "2 años",
    parentsLinked: 1,
    parentsLabel: "1 padre vinculado",
    allergies: "Asma leve. Monitor de esfuerzo.",
    birthDate: "2 may 2023",
    room: "Soles",
    joinDate: "may 2025",
    parents: [
      { name: "Camila Vega", role: "Mamá", initial: "C", avatarColor: "#A9D9E8", status: "active" },
      { name: "Andrés Vega", role: "Papá", initial: "A", avatarColor: "#F4DC8E", status: "pending" },
    ],
  },
];
