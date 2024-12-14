const meusFontes = 'C:\\Fontes';
const servidorProg = 'U:\\Fontes'

export const paths = {
    home:            `${meusFontes}`,
    aFazer:          `${servidorProg}\\a fazer`,
    atualizar:       `${servidorProg}\\atualizar`,
    emAndamento:     `${servidorProg}\\em andamento`,
    semModificacoes: `${servidorProg}\\sem modificacoes`,
    consulta:        `${servidorProg}\\somente consulta`,
} as const;



export const menuItems = [
    { title: 'Home', caminhoPasta: paths.home },
    { title: 'A Fazer', caminhoPasta: paths.aFazer },
    { title: 'Atualizar', caminhoPasta: paths.atualizar },
    { title: 'Em Andamento', caminhoPasta: paths.emAndamento },
    { title: 'Sem Modificações', caminhoPasta: paths.semModificacoes },
    { title: 'Consulta', caminhoPasta: paths.consulta },
];