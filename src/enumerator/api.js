export const api = {

  admin: 'users/admin',
  absence: 'days-off',
  absenceReasons: 'days-off-reasons',

  bonus: 'bonus',

  categories: 'categories',
  changePassword: 'auth/{id}/change-password',
  charts: 'charts',
  collaborators: 'collaborator',
  collaboratorGetBy: 'collaborator/{id}',
  companies: 'companies',

  employees: 'employees',
  employeesMany: 'employees/many',

  getPeriodbyYear: 'collaborator/{id}/period',

  holidayNational: 'https://brasilapi.com.br/api/feriados/v1/{year}',
  holidayRegional: 'holiday/regional',
  holiday: 'holiday',
  holidayDelete: 'holiday/{id}',

  importCollaborators: 'collaborator/import',

  kpis: 'kpis',

  period: 'collaborator/{id}/period',

  vacationstatus: 'vacationrequest/status',

  resetPassword: 'auth/reset-password/{token}',
  reportOptions: 'reports-options',
  reports: 'reports/{id}',

  signin: 'login',
  situation: 'periodstatus',
  situationType: 'periodstatus/{type}',
  situationGetBy: 'periodstatus/{id}',
  sendRecoverEmail: '/auth/send-recover-email',

  vacation: 'vacationrequest',
  vacationrequest: 'vacationrequest/{id}',
  user: 'user',
  userDelete: 'user/{id}',
  userCollaborator: 'collaborator/all',

  globalsettings: 'globalsettings'
}
