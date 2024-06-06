import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { RoleService } from '../services/role/role.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const roleService: RoleService = inject(RoleService);

  //RoleService checks permissions
  return roleService.hasPermission('getall:trips');
};
