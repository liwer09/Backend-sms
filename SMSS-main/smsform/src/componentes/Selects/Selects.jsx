import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import {getgroups} from '../Query/querygroups';


const GruposImplicados = [
    { value: 'GIC España', label: 'GIC España' },
    { value: 'GIC Pais', label: 'GIC Pais' },
    { value: 'COMMS N2', label: 'COMMS N2' },
    { value: 'COMMS N3', label: 'COMMS N3' },
    { value: 'COMMS CGP', label: 'COMMS CGP' },
    { value: 'COMMS Pais', label: 'COMMS Pais' },
    { value: 'Sistemas Logicalis', label: 'Sistemas Logicalis' },
    { value: 'Sistemas Pais', label: 'Sistemas Pais' },
    { value: 'CAU', label: 'CAU' },
    { value: 'Workplace', label: 'Workplace' },
    { value: 'Soporte Pais', label: 'Soporte Pais' },
    { value: 'B2B N2', label: 'B2B N2' },
    { value: 'B2B N3', label: 'B2B N3' }
];
const Estado = [
    { value: 'Nuevo', label: 'Nuevo' },
    { value: 'En curso', label: 'En curso' },
    { value: 'Resuelto', label: 'Resuelto' }
];


function SelectorGrupoNoti({ Seleccion }) {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const gruposData = await getgroups();
                console.log(gruposData);
                // Transforma los datos al formato deseado
                const transformedData = gruposData.map(grupo => ({
                    value: grupo.id,
                    label: grupo.name
                }));

                setData(transformedData);
            } catch (error) {
                // Manejar el error aquí según tus necesidades
                console.error('Error fetching groups data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <Select
            closeMenuOnSelect={true}
            options={data}
            onChange={v => { Seleccion(v) }}
        />
    );
}

function SelectorState({ Seleccion }) {
    return (
        <Select
            closeMenuOnSelect={true}
            options={Estado}
            onChange={v => { Seleccion(v) }}
        />
    );
}

function SelectorGrupoAsign({ Seleccion }) {
    return (
        <Select
            closeMenuOnSelect={false}
            options={GruposImplicados}
            onChange={(selectedOptions) => {
                const selectedValues = selectedOptions.map((option) => option.value);
                Seleccion(selectedValues);
            }}
            isMulti
        />
    );
}

export { SelectorGrupoNoti, SelectorGrupoAsign, SelectorState };

