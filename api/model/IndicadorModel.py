'''
Created on 28/03/2013

@author: alasarr
'''

from model.base.PostgreSQL.PostgreSQLModel import PostgreSQLModel
import base

class IndicadorModel(PostgreSQLModel):
    
    def getIndicadores(self):
        sql = "SELECT fecha FROM portico.incidencias_2 i" \
                " where i.geom is null";
#         
#         sql2= "SELECT i.id_incidencia, i.titulo, i.descripcion, i.estado, i.id_equipamiento, i.fecha_crea, i.id_user, m.nombre as nombre_municipio , EXTRACT(DAY FROM (now() - i.fecha_crea)) as dias, EXTRACT(EPOCH FROM (now() - i.fecha_crea)) as segundos FROM portico.incidencias_2 i" \
#                 " INNER JOIN geometries_eiel.municipio m ON ST_Intersects(ST_Transform(m.geom,4326),i.geom)" \
#                 " where i.geom is not null" ;
#               
#         if (search != None):
#             sql += " AND ( i.titulo iLIKE %s)"
#             sql2 += " AND ( i.titulo iLIKE %s)"
#              
#         
#         sql = sql + " UNION " + sql2 ;
#         
#         sql += " ORDER BY segundos";
#         
#         if ((limit != None) and (offset!= None)):
#             sql += " limit %s offset %s"
#          
#         if (search != None):
#             return self.query(sql,["%" + search + "%","%" + search + "%",limit,offset]).result()
#         
#         return self.query(sql,[limit,offset]).result()
        return true
        