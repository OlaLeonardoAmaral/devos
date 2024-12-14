const folderTest = '//Users//leonardoamaral//Documents//devosteste//';

export const pathsTest = {
    home:            `${folderTest}C//fontes`,
    aFazer:          `${folderTest}U//fontes//a fazer`,
    atualizar:       `${folderTest}U//fontes//atualizar`,
    emAndamento:     `${folderTest}U//fontes//em andamento`,
    semModificacoes: `${folderTest}U//fontes//sem modificações`,
    consulta:        `${folderTest}U//fontes//consulta`,
} as const;


export const menuItemsTest = [
    { title: 'Home', caminhoPasta: pathsTest.home },
    { title: 'A Fazer', caminhoPasta: pathsTest.aFazer },
    { title: 'Atualizar', caminhoPasta: pathsTest.atualizar },
    { title: 'Em Andamento', caminhoPasta: pathsTest.emAndamento },
    { title: 'Sem Modificações', caminhoPasta: pathsTest.semModificacoes },
    { title: 'Consulta', caminhoPasta: pathsTest.consulta },
];