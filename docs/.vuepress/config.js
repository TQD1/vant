module.exports = {
    title: 'LinkOffice9',
    description: '专为广联达协同人打造的好用的业务组件',
    head: [
        ['link', {
            rel: 'icon',
            href: `/favicon.ico`
        }]
    ],
    dest: './docs/.vuepress/dist',
    ga: '',
    evergreen: true,
	themeConfig: {
        nav: [
          { text: '首页', link: '/' },
          { text: '版本1.0.0', link: '/guide/' },
        ],
		sidebarDepth: 1,
    }
}