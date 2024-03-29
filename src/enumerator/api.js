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
  collaboratorModelImport: 'collaborator/modelimport',
  companies: 'companies',

  departament: 'departament',
  departamentDelete: 'departament/{id}',

  employees: 'employees',
  employeesMany: 'employees/many',

  getPeriodbyYear: 'period/{id}/collaborator',

  holidayNational: 'https://brasilapi.com.br/api/feriados/v1/{year}',
  holidayRegional: 'holiday/regional',
  holiday: 'holiday',
  holidayAll: 'holiday/all/{year}',
  holidayDelete: 'holiday/{id}',

  importCollaborators: 'collaborator/import',

  kpis: 'kpis',

  period: 'period/{id}/collaborator',

  profile: 'profile',
  profileDelete: 'profile/{id}',

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
