export const api = {
  admin: 'users/admin',
  absence: 'days-off',
  absenceReasons: 'days-off-reasons',

  bonus: 'bonus',

  categories: 'categories',
  changePassword: 'auth/{id}/change-password',
  charts: 'charts',
  collaborators: 'collaborator',
  collaboratorGetBy: '/collaborator/{id}',
  companies: 'companies',

  employees: 'employees',
  employeesMany: 'employees/many',

  importCollaborators: 'collaborator/bulk',
  kpis: 'kpis',

  resetPassword: 'auth/reset-password/{token}',
  reportOptions: 'reports-options',
  reports: 'reports/{id}',

  signin: 'login',
  situation: 'periodstatus',
  sendRecoverEmail: '/auth/send-recover-email',

  vacationrequest: 'vacationrequest',

  users: 'users'
}