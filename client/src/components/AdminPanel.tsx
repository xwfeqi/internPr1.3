import React, { useState, useEffect } from 'react';
import { fetchStudents, updateStudent } from '../services/admin-service';
import { IUser } from '../models/IUser';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';


const AdminPanel: React.FC = () => {
    const [students, setStudents] = useState<IUser[]>([]);
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [sortBy, setSortBy] = useState<string>('name');
    const [order, setOrder] = useState<'asc' | 'desc'>('asc');
    const [search, setSearch] = useState<string>('');
    const store = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        const loadStudents = async () => {
            const data = await fetchStudents(page, 10, sortBy, order, search);
            setStudents(data.students);
            setTotalPages(data.totalPages);
        };

        loadStudents();
    }, [page, sortBy, order, search]);

    useEffect(() => {
        if (!store.isAuth) {
            navigate('/login');
        } else if (store.user.role !== 'admin') {
            navigate('/profile');
        }
    }, [store.isAuth, store.user, navigate]);


    const handleSort = (column: keyof IUser) => {
        const newOrder = order === 'asc' ? 'desc' : 'asc';
        setSortBy(column);
        setOrder(newOrder);
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    return (
        <div>
            <input type="text" value={search} onChange={handleSearch} placeholder="Search students..." />
            <table>
                <thead>
                    <tr>
                        <th onClick={() => handleSort('id')}>Id</th>
                        <th onClick={() => handleSort('name')}>Name</th>
                        <th onClick={() => handleSort('email')}>Email</th>
                        <th onClick={() => handleSort('registeredDate')}>Registered Date</th>
                        <th onClick={() => handleSort('studyDate')}>Study Date</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map((student) => (
                        <tr key={student.id}>
                            <td>{student.id}</td>
                            <td>{student.name}</td>
                            <td>{student.email}</td>
                            <td>{new Date(student.registeredDate).toLocaleDateString()}</td>
                            <td>{new Date(student.studyDate).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div>
                {Array.from({ length: totalPages }, (_, i) => (
                    <button key={i + 1} onClick={() => handlePageChange(i + 1)}>
                        {i + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default AdminPanel;
