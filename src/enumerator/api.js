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

  getPeriodbyYear: 'collaborator/{id}/period',

  holydayNational: 'https://brasilapi.com.br/api/feriados/v1/{year}',
  importCollaborators: 'collaborator/import',

  kpis: 'kpis',

  period: 'collaborator/{id}/period',

  vacationstatus: 'vacationrequest/status',

  resetPassword: 'auth/reset-password/{token}',
  reportOptions: 'reports-options',
  reports: 'reports/{id}',

  signin: 'login',
  situation: 'periodstatus',
  sendRecoverEmail: '/auth/send-recover-email',

  vacation: 'vacationrequest',
  vacationrequest: 'vacationrequest/{id}',
  users: 'users'
}
