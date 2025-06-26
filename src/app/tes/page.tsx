'use client'; // Tandai sebagai Client Component karena ada interaktivitas (Navbar, Contact Form)

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import type { Metadata } from 'next'; // Tetap gunakan untuk metadata di layout.tsx jika tetap terpisah

// Jika kamu ingin metadata diatur langsung di page.tsx,
// kamu bisa menghapus metadata dari layout.tsx dan mendeklarasikannya di sini.
// Namun, biasanya metadata lebih baik di layout.tsx atau di file terpisah untuk halaman spesifik.
// export const metadata: Metadata = {
//     title: 'Nama Kamu - Portofolio Keren (Satu File)',
//     description: 'Portofolio saya yang menampilkan keahlian dan proyek-proyek saya.',
// };

// Data untuk komponen Skills
const skillsData = [
    { name: 'HTML & CSS', description: 'Struktur dan styling dasar web.', icon: '/images/html-css.png' },
    { name: 'JavaScript', description: 'Logika interaktif dan aplikasi web.', icon: '/images/javascript.png' },
    { name: 'React', description: 'Framework JavaScript populer.', icon: '/images/react.png' },
    { name: 'Tailwind CSS', description: 'Styling utility-first.', icon: '/images/tailwind.png' },
    { name: 'UI/UX Design', description: 'Desain antarmuka pengguna.', icon: '/images/ui-ux.png' },
    { name: 'Git & GitHub', description: 'Version Control System.', icon: '/images/github.png' },
];

// Data untuk komponen Projects
const projectsData = [
    {
        name: 'Nama Projek 1',
        description: 'Deskripsi singkat projek ini. Jelaskan teknologi yang digunakan atau masalah yang dipecahkan.',
        image: '/images/project1.jpg',
        technologies: ['React', 'Tailwind CSS', 'Firebase'],
        demoLink: '#',
        sourceLink: '#',
    },
    {
        name: 'Nama Projek 2',
        description: 'Deskripsi singkat projek ini. Jelaskan teknologi yang digunakan atau masalah yang dipecahkan.',
        image: '/images/project2.jpg',
        technologies: ['Vue.js', 'Node.js'],
        demoLink: '#',
        sourceLink: '#',
    },
    {
        name: 'Nama Projek 3',
        description: 'Deskripsi singkat projek ini. Jelaskan teknologi yang digunakan atau masalah yang dipecahkan.',
        image: '/images/project3.jpg',
        technologies: ['HTML', 'CSS', 'JavaScript'],
        demoLink: '#',
        sourceLink: '#',
    },
];

// Data untuk warna teknologi (Projects)
const technologyColors: { [key: string]: { bg: string; text: string; darkBg: string; darkText: string } } = {
    'React': { bg: 'bg-indigo-100', text: 'text-indigo-800', darkBg: 'dark:bg-indigo-900', darkText: 'dark:text-indigo-200' },
    'Tailwind CSS': { bg: 'bg-green-100', text: 'text-green-800', darkBg: 'dark:bg-green-900', darkText: 'dark:text-green-200' },
    'Firebase': { bg: 'bg-yellow-100', text: 'text-yellow-800', darkBg: 'dark:bg-yellow-900', darkText: 'dark:text-yellow-200' },
    'Vue.js': { bg: 'bg-purple-100', text: 'text-purple-800', darkBg: 'dark:bg-purple-900', darkText: 'dark:text-purple-200' },
    'Node.js': { bg: 'bg-red-100', text: 'text-red-800', darkBg: 'dark:bg-red-900', darkText: 'dark:text-red-200' },
    'HTML': { bg: 'bg-orange-100', text: 'text-orange-800', darkBg: 'dark:bg-orange-900', darkText: 'dark:text-orange-200' },
    'CSS': { bg: 'bg-blue-100', text: 'text-blue-800', darkBg: 'dark:bg-blue-900', darkText: 'dark:text-blue-200' },
    'JavaScript': { bg: 'bg-pink-100', text: 'text-pink-800', darkBg: 'dark:bg-pink-900', darkText: 'dark:text-pink-200' },
};

// --- Komponen Navbar ---
const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md dark:bg-gray-800">
            <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                    Nama Kamu
                </Link>
                <div className="hidden md:flex space-x-6">
                    <Link href="#about" className="text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 transition duration-300">
                        Tentang
                    </Link>
                    <Link href="#skills" className="text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 transition duration-300">
                        Keahlian
                    </Link>
                    <Link href="#projects" className="text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 transition duration-300">
                        Projek
                    </Link>
                    <Link href="#contact" className="text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 transition duration-300">
                        Kontak
                    </Link>
                </div>
                <button
                    className="md:hidden text-gray-600 dark:text-gray-300 focus:outline-none"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                </button>
            </nav>
            <div
                id="mobile-menu"
                className={`md:hidden bg-white dark:bg-gray-800 py-2 ${isOpen ? 'block' : 'hidden'}`}
            >
                <Link href="#about" onClick={() => setIsOpen(false)} className="block px-6 py-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition duration-300">Tentang</Link>
                <Link href="#skills" onClick={() => setIsOpen(false)} className="block px-6 py-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition duration-300">Keahlian</Link>
                <Link href="#projects" onClick={() => setIsOpen(false)} className="block px-6 py-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition duration-300">Projek</Link>
                <Link href="#contact" onClick={() => setIsOpen(false)} className="block px-6 py-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition duration-300">Kontak</Link>
            </div>
        </header>
    );
};

// --- Komponen Hero ---
const Hero = () => {
    return (
        <section id="hero" className="h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-700 dark:to-purple-800 text-white text-center p-8">
            <div className="max-w-4xl">
                <Image
                    src="/images/profile.jpg"
                    alt="Foto Profil"
                    width={150}
                    height={150}
                    className="rounded-full w-32 h-32 mx-auto mb-6 border-4 border-white shadow-lg object-cover"
                    priority
                />
                <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-4">Halo, saya <span className="text-yellow-300">Nama Kamu</span></h1>
                <p className="text-xl md:text-2xl mb-8">Seorang [Profesi Anda, misal: Pengembang Web | Desainer UI/UX | Penulis Konten] yang bersemangat menciptakan solusi inovatif.</p>
                <Link href="#projects" className="bg-white text-indigo-600 hover:bg-indigo-100 py-3 px-8 rounded-full text-lg font-semibold shadow-lg transform hover:scale-105 transition duration-300">
                    Lihat Projek Saya
                </Link>
            </div>
        </section>
    );
};

// --- Komponen About ---
const About = () => {
    return (
        <section id="about" className="py-20 bg-gray-50 dark:bg-gray-900 px-6">
            <div className="container mx-auto max-w-4xl text-center">
                <h2 className="text-4xl font-bold mb-8 text-gray-800 dark:text-gray-100">Tentang Saya</h2>
                <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 mb-6">
                    Saya adalah seorang pengembang web front-end dengan pengalaman lebih dari 5 tahun. Saya suka mengubah ide kompleks menjadi antarmuka pengguna yang indah dan fungsional. Saya memiliki passion dalam mempelajari teknologi baru dan berkontribusi pada komunitas open-source.
                </p>
                <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                    Saya percaya pada desain yang berpusat pada pengguna dan kode yang bersih serta terstruktur. Portofolio ini menampilkan beberapa pekerjaan terbaik saya dan keahlian yang telah saya kembangkan selama bertahun-tahun.
                </p>
            </div>
        </section>
    );
};

// --- Komponen Skills ---
const Skills = () => {
    return (
        <section id="skills" className="py-20 bg-white dark:bg-gray-800 px-6">
            <div className="container mx-auto max-w-5xl text-center">
                <h2 className="text-4xl font-bold mb-8 text-gray-800 dark:text-gray-100">Keahlian Saya</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {skillsData.map((skill, index) => (
                        <div key={index} className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg shadow-md hover:shadow-xl transform hover:scale-105 transition duration-300">
                            <Image
                                src={skill.icon}
                                alt={`Icon ${skill.name}`}
                                width={64}
                                height={64}
                                className="mx-auto mb-4"
                            />
                            <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">{skill.name}</h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">{skill.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// --- Komponen Projects ---
const Projects = () => {
    return (
        <section id="projects" className="py-20 bg-gray-50 dark:bg-gray-900 px-6">
            <div className="container mx-auto max-w-6xl text-center">
                <h2 className="text-4xl font-bold mb-8 text-gray-800 dark:text-gray-100">Projek Terbaru Saya</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projectsData.map((project, index) => (
                        <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition duration-300">
                            <Image
                                src={project.image}
                                alt={project.name}
                                width={400}
                                height={250}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-6">
                                <h3 className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-100">{project.name}</h3>
                                <p className="text-gray-700 dark:text-gray-300 mb-4 text-sm">{project.description}</p>
                                <div className="flex flex-wrap justify-center mb-4">
                                    {project.technologies.map((tech, techIndex) => {
                                        const colors = technologyColors[tech] || { bg: 'bg-gray-100', text: 'text-gray-800', darkBg: 'dark:bg-gray-700', darkText: 'dark:text-gray-200' };
                                        return (
                                            <span key={techIndex} className={`${colors.bg} ${colors.text} ${colors.darkBg} ${colors.darkText} text-xs font-medium px-2.5 py-0.5 rounded-full mr-2 mb-2`}>
                                                {tech}
                                            </span>
                                        );
                                    })}
                                </div>
                                <div className="flex justify-center space-x-4">
                                    <Link href={project.demoLink} target="_blank" className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-semibold transition duration-300">
                                        Lihat Demo
                                    </Link>
                                    <Link href={project.sourceLink} target="_blank" className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-200 font-semibold transition duration-300">
                                        Kode Sumber
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// --- Komponen Contact ---
const Contact = () => {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        alert('Pesan terkirim! (Ini hanya simulasi)');
        e.currentTarget.reset();
    };

    return (
        <section id="contact" className="py-20 bg-white dark:bg-gray-800 px-6">
            <div className="container mx-auto max-w-xl text-center">
                <h2 className="text-4xl font-bold mb-8 text-gray-800 dark:text-gray-100">Hubungi Saya</h2>
                <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 mb-8">
                    Tertarik untuk berkolaborasi atau hanya ingin menyapa? Jangan ragu untuk menghubungi saya melalui formulir di bawah ini atau melalui media sosial.
                </p>
                <form onSubmit={handleSubmit} className="bg-gray-50 dark:bg-gray-700 p-8 rounded-lg shadow-lg">
                    <div className="mb-6">
                        <input type="text" id="name" name="name" placeholder="Nama Anda" className="w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
                    </div>
                    <div className="mb-6">
                        <input type="email" id="email" name="email" placeholder="Email Anda" className="w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
                    </div>
                    <div className="mb-6">
                        <textarea id="message" name="message" rows={6} placeholder="Pesan Anda" className="w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500" required></textarea>
                    </div>
                    <button type="submit" className="w-full bg-indigo-600 text-white py-3 px-6 rounded-md font-semibold hover:bg-indigo-700 transform hover:scale-105 transition duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">Kirim Pesan</button>
                </form>
                <div className="mt-8 flex justify-center space-x-6">
                    <Link href="#" target="_blank" className="text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 text-3xl">
                        <i className="fab fa-linkedin"></i> LinkedIn
                    </Link>
                    <Link href="#" target="_blank" className="text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 text-3xl">
                        <i className="fab fa-github"></i> GitHub
                    </Link>
                    <Link href="#" target="_blank" className="text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 text-3xl">
                        <i className="fab fa-twitter"></i> Twitter
                    </Link>
                </div>
            </div>
        </section>
    );
};

// --- Komponen Footer ---
const Footer = () => {
    return (
        <footer className="bg-gray-800 dark:bg-gray-950 text-white py-8 text-center">
            <div className="container mx-auto px-6">
                <p>&copy; 2025 Nama Kamu. Hak Cipta Dilindungi.</p>
                <p className="text-sm mt-2">Dibuat dengan ❤️ dan <Link href="https://nextjs.org/" target="_blank" className="text-indigo-400 hover:underline">Next.js</Link> & <Link href="https://tailwindcss.com/" target="_blank" className="text-indigo-400 hover:underline">Tailwind CSS</Link></p>
            </div>
        </footer>
    );
};

// --- Halaman Utama (Main Page Component) ---
export default function HomePage() {
    return (
        <>
            <Navbar />
            <main className="pt-20"> {/* Sesuaikan padding jika navbar fixed */}
                <Hero />
                <About />
                <Skills />
                <Projects />
                <Contact />
            </main>
            <Footer />
        </>
    );
}